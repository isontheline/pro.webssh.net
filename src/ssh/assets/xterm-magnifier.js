/**
 * MagnifierAddon
 * Xterm.js addon: circular magnifier that follows touch/pointer movement
 * and magnifies the WebGL renderer canvas. DPI-aware, no external deps.
 * 
 * Copyright (c) 2025, Arnaud MENGUS (MIT License)
 * https://github.com/isontheline/pro.webssh.net
 * @license MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
class MagnifierAddon {
    constructor(opts = {}) {
        this._term = undefined;
        this._container = undefined;
        this._overlayHost = undefined;
        this._lensCanvas = undefined;
        this._ctx = null;

        this._sourceCanvas = undefined;
        this._radius = opts.radius ?? 88; // px
        this._zoom = Math.max(1, opts.zoom ?? 2.0);
        this._border = opts.border ?? '2px solid rgba(255,255,255,0.8)';
        this._boxShadow = opts.boxShadow ?? '0 8px 24px rgba(0,0,0,0.35)';
        this._holdToShow = (opts.holdToShow ?? true);
        this._canvasSelector = opts.canvasSelector;
        this._debug = !!opts.debug;

        this._enabled = false;
        this._visible = false;
        this._raf = 0;
        this._dirty = false;
        this._pointerX = 0;
        this._pointerY = 0;

        this._resizeObs = undefined;
        this._mutationObs = undefined;
        this._pointerDown = false;
        this._waitTicker = 0; // frames spent waiting for pixels

        this._edgeInset = opts.edgeInset ?? 8;          // px: padding from container bounds
        this._gap = opts.gap ?? 8;                      // px: gap between finger and lens
        this._touchAvoidRadius = opts.touchAvoidRadius ?? 28; // px: approx half of 56px touch contact
        this._lastPointerType = 'mouse';                // remember last pointer type

        this._sideSnapOnly = opts.sideSnapOnly ?? true;              // force left/right docking
        this._sideSnapHysteresis = opts.sideSnapHysteresis ?? 24;    // px: minimize flip-flop
        this._sidePreference = opts.sidePreference ?? 'auto';        // 'auto' | 'left' | 'right'
        this._currentSide = null;                                    // 'left' | 'right'
    }

    activate(terminal) {
        this._term = terminal;

        requestAnimationFrame(() => {
            this._container = terminal.element;
            if (!this._container) return;

            const root = this._container.querySelector('.xterm') || this._container;
            if (getComputedStyle(root).position === 'static') root.style.position = 'relative';

            // Transparent overlay to capture pointer/touch
            this._overlayHost = document.createElement('div');
            Object.assign(this._overlayHost.style, {
                position: 'absolute',
                inset: '0',
                zIndex: '40',
                pointerEvents: 'auto',
                touchAction: 'none',
                background: 'transparent'
            });

            // Lens canvas
            this._lensCanvas = document.createElement('canvas');
            this._lensCanvas.width = this._lensCanvas.height = this._lensPixelSize();
            Object.assign(this._lensCanvas.style, {
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: `${this._radius * 2}px`,
                height: `${this._radius * 2}px`,
                border: this._border,
                borderRadius: '9999px',
                boxShadow: this._boxShadow,
                pointerEvents: 'none',
                willChange: 'transform',
                visibility: 'hidden'
            });
            this._ctx = this._lensCanvas.getContext('2d');

            root.appendChild(this._overlayHost);
            root.appendChild(this._lensCanvas);

            // Locate renderer canvas
            this._sourceCanvas = this._findSourceCanvas(root);
            if (this._debug) console.log('[Magnifier] sourceCanvas=', this._sourceCanvas);

            // Keep overlay sized to .xterm-screen
            this._resizeObs = new ResizeObserver(() => this._syncOverlayBounds());
            this._resizeObs.observe(root);
            this._syncOverlayBounds();

            // Detect renderer re-initialisation/swaps
            this._mutationObs = new MutationObserver(() => {
                const next = this._findSourceCanvas(root);
                if (next !== this._sourceCanvas) {
                    if (this._debug) console.log('[Magnifier] renderer swapped');
                    this._sourceCanvas = next;
                    this._waitTicker = 0;
                    this._markDirty();
                }
            });
            this._mutationObs.observe(root, { childList: true, subtree: true });

            this._bindEvents();
            this.enable();
        });
    }

    dispose() {
        cancelAnimationFrame(this._raf);
        this._raf = 0;
        this._enabled = false;
        this._visible = false;

        if (this._overlayHost && this._overlayHost.isConnected) this._overlayHost.remove();
        if (this._lensCanvas && this._lensCanvas.isConnected) this._lensCanvas.remove();

        if (this._resizeObs) this._resizeObs.disconnect();
        if (this._mutationObs) this._mutationObs.disconnect();

        this._overlayHost = undefined;
        this._lensCanvas = undefined;
        this._ctx = null;
        this._sourceCanvas = null;
    }

    enable() {
        if (this._enabled) return;
        this._enabled = true;
        if (this._overlayHost) this._overlayHost.style.pointerEvents = 'auto';
    }

    disable() {
        if (!this._enabled) return;
        this._enabled = false;
        this._hideLens();
        if (this._overlayHost) this._overlayHost.style.pointerEvents = 'none';
        this._currentSide = null;
    }

    setZoom(factor) {
        this._zoom = Math.max(1, factor);
        this._markDirty();
    }

    setRadius(px) {
        this._radius = Math.max(16, px);
        if (!this._lensCanvas) return;
        const size = this._lensPixelSize();
        this._lensCanvas.width = this._lensCanvas.height = size;
        this._lensCanvas.style.width = `${this._radius * 2}px`;
        this._lensCanvas.style.height = `${this._radius * 2}px`;
        this._markDirty();
    }

    // ---------------- internals ----------------

    _bindEvents() {
        if (!this._overlayHost) return;
        const opts = { passive: false };

        this._overlayHost.addEventListener('pointerdown', (e) => {
            if (!this._enabled) return;
            try { this._overlayHost.setPointerCapture(e.pointerId); } catch (_) { }
            this._pointerDown = true;
            this._updatePointer(e);
            if (this._holdToShow) this._showLens();
            e.preventDefault();
        }, opts);

        this._overlayHost.addEventListener('pointermove', (e) => {
            if (!this._enabled) return;
            this._updatePointer(e);
            if (!this._holdToShow && !this._visible) this._showLens();
            // Draw immediately on the first move to avoid a blank frame
            if (this._visible) this._drawLens();
            e.preventDefault();
        }, opts);

        const end = (e) => {
            if (!this._enabled) return;
            try { this._overlayHost.releasePointerCapture?.(e.pointerId); } catch (_) { }
            this._pointerDown = false;
            if (this._holdToShow) this._hideLens();
            e.preventDefault();
        };

        this._overlayHost.addEventListener('pointerup', end, opts);
        this._overlayHost.addEventListener('pointercancel', end, opts);
        this._overlayHost.addEventListener('pointerleave', (e) => {
            if (!this._enabled) return;
            if (this._holdToShow || !this._pointerDown) this._hideLens();
            e.preventDefault();
        }, opts);

        // Hover mode when holdToShow=false
        this._overlayHost.addEventListener('mouseenter', (e) => {
            if (!this._enabled || this._holdToShow) return;
            this._updatePointer(e);
            this._showLens();
            this._drawLens();
        }, opts);

        this._overlayHost.addEventListener('mouseleave', () => {
            if (!this._enabled || this._holdToShow) return;
            this._hideLens();
        }, opts);
    }

    _updatePointer(e) {
        const hostRect = this._overlayHost.getBoundingClientRect();
        this._pointerX = e.clientX - hostRect.left;
        this._pointerY = e.clientY - hostRect.top;
        this._lastPointerType = e.pointerType || this._lastPointerType;
        this._positionLens();
        this._markDirty();
    }

    _showLens() {
        if (!this._lensCanvas || this._visible) return;
        this._visible = true;
        this._lensCanvas.style.visibility = 'visible';
        this._positionLens();
        this._renderLoop();
    }

    _hideLens() {
        if (!this._lensCanvas || !this._visible) return;
        this._visible = false;
        this._lensCanvas.style.visibility = 'hidden';
        cancelAnimationFrame(this._raf);
        this._raf = 0;
        this._currentSide = null;
    }

    _positionLens() {
        if (!this._lensCanvas || !this._overlayHost) return;
        if (this._sideSnapOnly) {
            this._placeLensSideOnly();
        } else {
            this._placeLensSmart();
        }
    }

    _markDirty() {
        this._dirty = true;
        if (this._visible && !this._raf) this._renderLoop();
    }

    _renderLoop() {
        if (!this._visible) return;
        this._raf = requestAnimationFrame(() => {
            if (this._dirty) this._drawLens();
            this._renderLoop();
        });
    }

    _drawLens() {
        this._dirty = false;
        if (!this._ctx || !this._lensCanvas || !this._sourceCanvas) return;

        const ctx = this._ctx;
        const lens = this._lensCanvas;
        const src = this._sourceCanvas;

        // Wait for a valid source size (renderer can be 0×0 briefly)
        if (!src.width || !src.height) {
            if (this._debug && (this._waitTicker++ % 30 === 0)) {
                console.warn('[Magnifier] waiting for renderer pixels…', { w: src.width, h: src.height });
            }
            this._markDirty();
            return;
        }

        // Check if this is a WebGL canvas without preserveDrawingBuffer
        const gl = src.getContext('webgl', { preserveDrawingBuffer: false }) ||
            src.getContext('webgl2', { preserveDrawingBuffer: false }) ||
            src.getContext('experimental-webgl', { preserveDrawingBuffer: false });

        if (gl) {
            const attrs = gl.getContextAttributes();
            if (!attrs?.preserveDrawingBuffer) {
                if (this._debug && this._waitTicker === 0) {
                    console.error('[Magnifier] WebGL canvas detected without preserveDrawingBuffer!');
                    console.error('[Magnifier] The magnifier will show blank content.');
                    console.error('[Magnifier] Fix: Initialize WebglAddon with: new WebglAddon(true)');
                }
                this._waitTicker++;
                // Draw a placeholder to show the lens is working but can't capture WebGL
                ctx.clearRect(0, 0, lens.width, lens.height);
                ctx.save();
                const dpr = window.devicePixelRatio || 1;
                const rPx = lens.width / 2;
                ctx.beginPath();
                ctx.arc(rPx, rPx, rPx - (2 * dpr), 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 100, 100, 0.1)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
                return;
            }
        }

        this._waitTicker = 0;

        const dpr = window.devicePixelRatio || 1;
        // Use intrinsic pixel size as the truth
        const scaleX = src.width / (src.clientWidth || 1);
        const scaleY = src.height / (src.clientHeight || 1);

        const lensPx = this._lensPixelSize(); // 2*radius*dpr
        const rPx = lensPx / 2;

        // Pointer in page coords -> source canvas CSS coords
        const srcRect = src.getBoundingClientRect();
        const hostRect = this._overlayHost.getBoundingClientRect();
        const ptrClientX = this._pointerX + hostRect.left;
        const ptrClientY = this._pointerY + hostRect.top;

        const srcXcss = ptrClientX - srcRect.left;
        const srcYcss = ptrClientY - srcRect.top;

        // Convert to source pixel space
        let srcX = srcXcss * scaleX;
        let srcY = srcYcss * scaleY;

        // Desired source rect (centered on pointer)
        let sw = (rPx * 2) / this._zoom;
        let sh = (rPx * 2) / this._zoom;
        let sx = srcX - sw / 2;
        let sy = srcY - sh / 2;

        // ---- Clamp to source bounds so we never sample out-of-range ----
        if (sx < 0) { sw += sx; sx = 0; }
        if (sy < 0) { sh += sy; sy = 0; }
        if (sx + sw > src.width) sw = src.width - sx;
        if (sy + sh > src.height) sh = src.height - sy;

        if (sw <= 0 || sh <= 0) {
            if (this._debug) console.warn('[Magnifier] sample rect empty; skipping draw', { sx, sy, sw, sh });
            return;
        }

        // Clear & clip to circle
        ctx.clearRect(0, 0, lens.width, lens.height);
        ctx.save();
        ctx.beginPath();
        ctx.arc(rPx, rPx, rPx - (2 * dpr), 0, Math.PI * 2);
        ctx.clip();

        // Draw magnified region
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        try {
            ctx.drawImage(src, sx, sy, sw, sh, 0, 0, lens.width, lens.height);
        } catch (e) {
            if (this._debug) {
                console.error('[Magnifier] drawImage failed:', e);
                console.error('[Magnifier] This usually means WebGL preserveDrawingBuffer is not enabled');
            }
            // Draw error indicator
            ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
            ctx.fillRect(0, 0, lens.width, lens.height);
        }

        ctx.restore();
    }

    _lensPixelSize() {
        const dpr = window.devicePixelRatio || 1;
        return Math.max(2, Math.round(this._radius * 2 * dpr));
    }

    _syncOverlayBounds() {
        if (!this._overlayHost || !this._container) return;
        const screen = this._container.querySelector('.xterm-screen') || this._container;
        const rect = screen.getBoundingClientRect();

        const root = this._container.querySelector('.xterm') || this._container;
        const rootRect = root.getBoundingClientRect();

        const offsetLeft = rect.left - rootRect.left;
        const offsetTop = rect.top - rootRect.top;

        Object.assign(this._overlayHost.style, {
            left: `${offsetLeft}px`,
            top: `${offsetTop}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`
        });

        this._markDirty();
    }

    _findSourceCanvas(root) {
        const screen = root.querySelector('.xterm-screen') || root;

        if (this._canvasSelector) {
            const m = screen.querySelector(this._canvasSelector);
            if (m && m.tagName === 'CANVAS') return m;
        }

        // Prefer canvases with real pixel buffers (width*height), not just CSS size.
        const canvases = Array.from(screen.querySelectorAll('canvas'));
        if (canvases.length === 0) return null;

        canvases.sort((a, b) => (b.width * b.height) - (a.width * a.height));
        const chosen = canvases[0] || null;

        // If chosen has 0×0 now, we’ll still use it but wait until it gets pixels.
        return chosen;
    }

    _placeLensSideOnly() {
        const r = this._radius;
        const hostRect = this._overlayHost.getBoundingClientRect();
        const W = hostRect.width;
        const H = hostRect.height;

        const x = this._pointerX;
        const y = this._pointerY;

        const baseClear = r + this._gap;
        const avoid = (this._lastPointerType === 'touch')
            ? (this._touchAvoidRadius + baseClear)
            : baseClear;

        const edge = this._edgeInset;

        // Decide side with hysteresis around the midline using room delta.
        let desiredSide;
        if (this._sidePreference === 'left' || this._sidePreference === 'right') {
            desiredSide = this._sidePreference;
        } else {
            const roomLeft = x;        // space to left edge
            const roomRight = W - x;    // space to right edge
            const delta = roomRight - roomLeft;

            if (!this._currentSide) {
                desiredSide = (delta >= 0) ? 'right' : 'left';
            } else if (this._currentSide === 'right') {
                desiredSide = (delta < -this._sideSnapHysteresis) ? 'left' : 'right';
            } else {
                desiredSide = (delta > this._sideSnapHysteresis) ? 'right' : 'left';
            }
        }

        // Candidate position on chosen side
        let cx = (desiredSide === 'right') ? (x + avoid) : (x - avoid);
        let cy = y;

        // Clamp inside overlay
        const clampedCx = Math.max(edge + r, Math.min(cx, W - edge - r));
        const clampedCy = Math.max(edge + r, Math.min(cy, H - edge - r));

        // Safety fallback: if clamping pushed us so close that the lens edge
        // overlaps the finger, flip to opposite side (matters at extreme edges).
        const nearEdgeDistance = Math.abs(clampedCx - x) - r;
        const minClear = (this._lastPointerType === 'touch')
            ? (this._touchAvoidRadius + this._gap)
            : this._gap;

        if (nearEdgeDistance < minClear) {
            // Flip
            desiredSide = (desiredSide === 'right') ? 'left' : 'right';
            cx = (desiredSide === 'right') ? (x + avoid) : (x - avoid);
        }

        this._currentSide = desiredSide;

        // Final clamp & apply
        const finalCx = Math.max(edge + r, Math.min(cx, W - edge - r));
        const finalCy = Math.max(edge + r, Math.min(cy, H - edge - r));
        this._lensCanvas.style.transform = `translate3d(${finalCx - r}px, ${finalCy - r}px, 0)`;
    }

    _placeLensSmart() {
        const r = this._radius;
        const hostRect = this._overlayHost.getBoundingClientRect();
        const W = hostRect.width;
        const H = hostRect.height;
        const x = this._pointerX;
        const y = this._pointerY;

        const baseClear = r + this._gap;
        const avoid = (this._lastPointerType === 'touch')
            ? (this._touchAvoidRadius + baseClear)
            : baseClear;

        const edge = this._edgeInset;

        const roomLeft = x;
        const roomRight = W - x;
        const roomTop = y;
        const roomBot = H - y;

        // Prefer side with more room unless very close to top/bottom thirds
        const topBand = H * 0.33;
        const bottomBand = H * 0.67;
        const sideBias = (roomRight >= roomLeft) ? ['right', 'left'] : ['left', 'right'];

        const order = (y <= topBand)
            ? ['bottom', ...sideBias, 'top']
            : (y >= bottomBand)
                ? ['top', ...sideBias, 'bottom']
                : [...sideBias, (roomTop >= roomBot ? 'top' : 'bottom')];

        const edgeClamp = (cx, cy) => ([
            Math.max(edge + r, Math.min(cx, W - edge - r)),
            Math.max(edge + r, Math.min(cy, H - edge - r))
        ]);

        const candidates = order.map(a => {
            let cx = x, cy = y;
            switch (a) {
                case 'left': cx = x - avoid; break;
                case 'right': cx = x + avoid; break;
                case 'top': cy = y - avoid; break;
                case 'bottom': cy = y + avoid; break;
            }
            const [clx, cly] = edgeClamp(cx, cy);
            return { a, cx: clx, cy: cly };
        });

        // Score: distance from finger (visibility) + mild center bias (stability)
        const score = ({ cx, cy }) => {
            const dist = Math.hypot(cx - x, cy - y);
            const centerBias = (W / 2 - Math.abs(cx - W / 2)) + (H / 2 - Math.abs(cy - H / 2));
            return dist * 2 + centerBias * 0.25;
        };

        candidates.sort((A, B) => score(B) - score(A));
        const best = candidates[0];

        this._lensCanvas.style.transform = `translate3d(${best.cx - r}px, ${best.cy - r}px, 0)`;
    }
}