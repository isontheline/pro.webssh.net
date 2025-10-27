// MIT License
// Original Work -> Copyright (c) 2023 Raunak Raj : https://github.com/bajrangCoder/acode-plugin-acodex
// Converting to Xterm.js addon -> Copyright (c) 2025 Arnaud MENGUS : https://github.com/isontheline/pro.webssh.net

class SelectionHandlesAddon {
  // State
  isSelecting = false;
  isTapAndHoldActive = false;
  tapHoldTimeout = null;
  selectionStart = null; // {row, column}
  selectionEnd = null;   // {row, column}
  _selectionAnchor = null;
  _activeHandle = null;
  _movedBeyondThreshold = false;
  _lastPointer = null;

  // thresholds
  scrollThreshold = 10; // px
  scrollTimeThreshold = 100; // ms
  touchMoveThreshold = 5; // px
  handleSize = 20;

  // refs
  terminal = null;
  terminalContainer = null;
  startHandle = null;
  endHandle = null;

  // xterm disposables
  _onSelectionChangeDisposable = null;
  _onScrollDisposable = null;
  _onResizeDisposable = null;

  // Addon configuration
  settings = {
    selectionHaptics: true,
    enableDesktop: true,
    autoCopyOnSelection: false,
    useHandlesOnCoarsePointer: true
  };

  constructor(options = {}) {
    this.settings = { ...this.settings, ...options };
  }

  // xterm.js entry points
  activate(terminal) {
    this.terminal = terminal;

    if (!terminal.element) {
      console.error('Terminal element not found. Make sure to call terminal.open() before loading addons.');
      return;
    }

    this.terminalContainer = terminal.element.parentElement;
    if (!this.terminalContainer) {
      console.error('Terminal container not found');
      return;
    }

    this._createHandles();
    this._attachEventListeners();
  }

  dispose() {
    this.destroy();
  }

  // UI helpers
  _createHandles() {
    const styleText = `
      z-index: 1000;
      touch-action: none;
      pointer-events: auto;
      position: absolute;
      width: ${this.handleSize}px;
      height: ${this.handleSize}px;
      background-color: rgba(0, 0, 255, 0.7);
      border-radius: 50% 50% 50% 0;
      transform: rotate(135deg);
      display: none;
    `;
    this.startHandle = document.createElement("div");
    this.startHandle.className = "terminal-selection-handle start-handle";
    this.startHandle.style.cssText = styleText;

    this.endHandle = document.createElement("div");
    this.endHandle.className = "terminal-selection-handle end-handle";
    this.endHandle.style.cssText = styleText;

    this.terminalContainer.appendChild(this.startHandle);
    this.terminalContainer.appendChild(this.endHandle);
  }

  _attachEventListeners() {
    // Pointer events on terminal
    this._boundPointerDown = this.terminalPointerDownCb.bind(this);
    this.terminal.element.addEventListener('pointerdown', this._boundPointerDown, { passive: true });

    this._boundPointerMove = this.terminalPointerMoveCb.bind(this);
    this.terminal.element.addEventListener('pointermove', this._boundPointerMove, { passive: false });

    this._boundPointerUp = this.terminalPointerUpCb.bind(this);
    document.addEventListener('pointerup', this._boundPointerUp, { passive: true });

    // Handle interactions via pointer
    this._boundStartHandlePointerDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._activeHandle = 'start';
      try { this.startHandle.setPointerCapture(e.pointerId); } catch {}
    };
    this.startHandle.addEventListener('pointerdown', this._boundStartHandlePointerDown, { passive: false });

    this._boundEndHandlePointerDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._activeHandle = 'end';
      try { this.endHandle.setPointerCapture(e.pointerId); } catch {}
    };
    this.endHandle.addEventListener('pointerdown', this._boundEndHandlePointerDown, { passive: false });

    this._boundHandlePointerMove = this.handlePointerMoveCb.bind(this);
    this.startHandle.addEventListener('pointermove', this._boundHandlePointerMove, { passive: false });
    this.endHandle.addEventListener('pointermove', this._boundHandlePointerMove, { passive: false });

    this._boundHandlePointerUp = (e) => { this._activeHandle = null; };
    this.startHandle.addEventListener('pointerup', this._boundHandlePointerUp, { passive: true });
    this.endHandle.addEventListener('pointerup', this._boundHandlePointerUp, { passive: true });

    // Selection change from xterm
    this._boundSelectionChange = () => this.terminalSelectionChangeCb();
    try {
      // xterm onSelectionChange returns IDisposable; prefer that if available
      const d = this.terminal.onSelectionChange(this._boundSelectionChange);
      if (d && typeof d.dispose === 'function') this._onSelectionChangeDisposable = d;
    } catch {
      // fallback: no-op
    }

    // Click outside to remove selection
    this._boundRemoveSelection = this.removeSelectionCb.bind(this);
    document.addEventListener('pointerdown', this._boundRemoveSelection, { passive: true });

    // Resize and scroll updates
    this._boundOnResize = () => this.updateHandles();
    window.addEventListener('resize', this._boundOnResize, { passive: true });

    if (typeof this.terminal.onScroll === 'function') {
      const d = this.terminal.onScroll(this._boundOnResize);
      if (d && typeof d.dispose === 'function') this._onScrollDisposable = d;
    }
    if (typeof this.terminal.onResize === 'function') {
      const d = this.terminal.onResize(this._boundOnResize);
      if (d && typeof d.dispose === 'function') this._onResizeDisposable = d;
    }

    // Desktop cursor and handle visibility
    if (this.isFinePointer()) {
      this.terminal.element.style.cursor = 'text';
    }
    if (!this.isCoarsePointer() || !this.settings.useHandlesOnCoarsePointer) {
      this.hideHandles();
    }
  }

  // Feature detection
  isCoarsePointer() {
    return typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  }
  isFinePointer() {
    return typeof matchMedia === 'function' && matchMedia('(pointer: fine)').matches;
  }

  // Geometry
  _getCellSize() {
    // Access xterm.js internal render service
    const renderer = this.terminal?._core?._renderService?.dimensions;
    return {
      cellWidth: renderer?.css?.cell?.width ?? 9,
      cellHeight: renderer?.css?.cell?.height ?? 18,
    };
  }

  // Unified pointer coordinates -> terminal row/column
  getPointerCoordinates(event) {
    const rect = this.terminal.element.getBoundingClientRect();

    const clientX = event.clientX ?? (event.touches && event.touches[0]?.clientX) ?? 0;
    const clientY = event.clientY ?? (event.touches && event.touches[0]?.clientY) ?? 0;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const { cellWidth, cellHeight } = this._getCellSize();

    const scrollOffset = this.terminal.buffer.active.viewportY;
    const column = Math.max(0, Math.min(Math.floor(x / cellWidth), this.terminal.cols - 1));
    const row = Math.max(0, Math.floor(y / cellHeight) + scrollOffset);

    return { row, column };
  }

  // Handle positioning
  calculateHandlePosition(row, column, isStartHandle) {
    const { cellWidth, cellHeight } = this._getCellSize();
    const terminalRect = this.terminal.element.getBoundingClientRect();
    const containerRect = this.terminalContainer.getBoundingClientRect();

    const viewportScrollOffset = this.terminal.buffer.active.viewportY;
    const adjustedRow = row - viewportScrollOffset;

    let x;
    if (isStartHandle) {
      x = terminalRect.left + column * cellWidth;
    } else {
      x = terminalRect.left + (column + 1) * cellWidth;
    }

    let y = terminalRect.top + (adjustedRow + 1) * cellHeight - 2;

    x = x - containerRect.left;
    y = y - containerRect.top;

    x = Math.max(this.handleSize / 2, Math.min(x, containerRect.width - this.handleSize / 2));
    y = Math.max(this.handleSize / 2, Math.min(y, containerRect.height - this.handleSize / 2));

    return { x, y };
  }

  setHandlePosition(handle, row, column, isStartHandle = false) {
    const position = this.calculateHandlePosition(row, column, isStartHandle);

    handle.style.left = `${position.x - this.handleSize / 2}px`;
    handle.style.top = `${position.y - 2}px`;
    handle.style.display = "block";
  }

  hideHandles() {
    if (this.startHandle) this.startHandle.style.display = "none";
    if (this.endHandle) this.endHandle.style.display = "none";
  }

  showHandles() {
    if (!this.settings.useHandlesOnCoarsePointer) return;
    if (!this.isCoarsePointer()) return;
    if (this.selectionStart && this.selectionEnd) {
      this.setHandlePosition(this.startHandle, this.selectionStart.row, this.selectionStart.column, true);
      this.setHandlePosition(this.endHandle, this.selectionEnd.row, this.selectionEnd.column, false);
    }
  }

  // Selection model
  startSelection(row, column) {
    this.selectionStart = { row, column };
    this.selectionEnd = { row, column };
    this.isSelecting = true;

    this.terminal.focus();
    this.terminal.clearSelection();
    this.terminal.select(column, row, 1);

    this.showHandles();

    // Toggle CSS to prevent native selection only while selecting
    this.terminalContainer?.classList?.add('terminal-selecting');
    // Recommend in CSS: .terminal-selecting, .terminal-selecting * { user-select: none !important; }
  }

  updateSelection() {
    if (!this.selectionStart || !this.selectionEnd) return;

    this.terminal.clearSelection();

    let startRow = this.selectionStart.row;
    let startColumn = this.selectionStart.column;
    let endRow = this.selectionEnd.row;
    let endColumn = this.selectionEnd.column;

    const isSwapped = startRow > endRow || (startRow === endRow && startColumn > endColumn);
    if (isSwapped) {
      [startRow, startColumn, endRow, endColumn] = [endRow, endColumn, startRow, startColumn];
    }

    const totalLength = this._calculateTotalSelectionLength(startRow, endRow, startColumn, endColumn);
    this.terminal.select(startColumn, startRow, totalLength);

    // Handles follow the actual drag endpoints to preserve teardrop orientation
    this.setHandlePosition(this.startHandle, this.selectionStart.row, this.selectionStart.column, !isSwapped);
    this.setHandlePosition(this.endHandle, this.selectionEnd.row, this.selectionEnd.column, isSwapped);
  }

  _calculateTotalSelectionLength(startRow, endRow, startColumn, endColumn) {
    const terminalCols = this.terminal.cols;

    if (startRow === endRow) {
      return Math.max(1, endColumn - startColumn + 1);
    }

    let length = 0;
    length += terminalCols - startColumn; // first row remainder
    if (endRow - startRow - 1 > 0) {
      length += (endRow - startRow - 1) * terminalCols; // middle full rows
    }
    length += endColumn + 1; // last row up to endColumn
    return Math.max(1, length);
  }

  // Pointer handlers (terminal)
  terminalPointerDownCb(event) {
    // Only left button for desktop selection
    if (event.button !== undefined && event.button !== 0) return;

    this._lastPointer = event;
    this.terminal.focus();

    const coords = this.getPointerCoordinates(event);
    if (!coords) return;

    // Desktop double/triple click
    if (this.isFinePointer() && this.settings.enableDesktop) {
      if (event.detail === 2) {
        this._selectWordAt(coords);
        return;
      }
      if (event.detail >= 3) {
        this._selectLineAt(coords);
        return;
      }
    }

    if (this.isCoarsePointer() && event.pointerType === 'touch') {
      // Touch: long-press to start selection
      this.isTapAndHoldActive = false;
      clearTimeout(this.tapHoldTimeout);
      this._movedBeyondThreshold = false;

      this.tapHoldTimeout = setTimeout(() => {
        if (!this._movedBeyondThreshold) {
          this.isTapAndHoldActive = true;
          this.startSelection(coords.row, coords.column);
          if (this.settings.selectionHaptics && navigator.vibrate) {
            navigator.vibrate(30);
          }
        }
      }, 500);
    } else {
      // Desktop: immediate selection start, Shift+click to extend from anchor
      if (event.shiftKey && this._selectionAnchor) {
        this.selectionStart = { ...this._selectionAnchor };
        this.selectionEnd = { ...coords };
        this.isSelecting = true;
        this.updateSelection();
      } else {
        this.startSelection(coords.row, coords.column);
        this._selectionAnchor = { ...coords };
      }
    }

    // Capture pointer so we keep getting move events
    try { this.terminal.element.setPointerCapture(event.pointerId); } catch {}
  }

  terminalPointerMoveCb(event) {
    // Cancel long-press if touch moved significantly
    if (this.isCoarsePointer() && event.pointerType === 'touch' && this.tapHoldTimeout) {
      const dx = Math.abs(event.clientX - (this._lastPointer?.clientX ?? event.clientX));
      const dy = Math.abs(event.clientY - (this._lastPointer?.clientY ?? event.clientY));
      if (dx > this.touchMoveThreshold || dy > this.touchMoveThreshold) {
        this._movedBeyondThreshold = true;
        clearTimeout(this.tapHoldTimeout);
      }
    }

    if (!this.isSelecting) return;

    // Prevent native selection/scroll while dragging a selection
    event.preventDefault();

    const coords = this.getPointerCoordinates(event);
    if (!coords) return;

    this.selectionEnd = coords;
    this.updateSelection();
  }

  terminalPointerUpCb(event) {
    clearTimeout(this.tapHoldTimeout);

    if (!this.isSelecting) {
      // Ended without an active selection; ensure CSS toggle resets
      this.terminalContainer?.classList?.remove('terminal-selecting');
      return;
    }

    // Optional auto-copy on desktop
    if (this.settings.autoCopyOnSelection && navigator.clipboard && this.isFinePointer()) {
      const sel = this.terminal.getSelection?.();
      if (sel) {
        navigator.clipboard.writeText(sel).catch(() => {});
      }
    }

    if (!this.isCoarsePointer()) {
      // Hide handles for desktop
      this.hideHandles();
    } else {
      // Keep handles visible on touch
      this.showHandles();
    }

    // Selection finished
    this.isSelecting = false;
    this.terminalContainer?.classList?.remove('terminal-selecting');
    try { this.terminal.element.releasePointerCapture?.(event.pointerId); } catch {}
  }

  // Handle dragging (touch/coarse)
  handlePointerMoveCb(event) {
    if (!this._activeHandle) return;
    event.preventDefault();
    event.stopPropagation();

    const coords = this.getPointerCoordinates(event);
    if (!coords) return;

    if (this._activeHandle === 'start') {
      this.selectionStart = coords;
    } else {
      this.selectionEnd = coords;
    }
    this.isSelecting = true;
    this.updateSelection();
  }

  // Selection change callback
  terminalSelectionChangeCb() {
    const selection = this.terminal.getSelection?.();
    if (selection && selection.length > 0 && (this.isSelecting || this.isCoarsePointer())) {
      this.showHandles();
    } else if (!selection || selection.length === 0) {
      this.hideHandles();
      this.isSelecting = false;
    }
  }

  // Click/tap outside to clear selection
  removeSelectionCb(event) {
    const target = event.target;
    if (
      (this.startHandle && this.startHandle.contains(target)) ||
      (this.endHandle && this.endHandle.contains(target))
    ) {
      return;
    }

    if (this.terminal && !this.terminal.element.contains(target)) {
      this.isSelecting = false;
      this._activeHandle = null;
      this.terminal.clearSelection();
      this.hideHandles();
      this.terminalContainer?.classList?.remove('terminal-selecting');
    }
  }

  // Keep handle positions in sync
  updateHandles() {
    if (this.selectionStart && this.selectionEnd) {
      this.setHandlePosition(this.startHandle, this.selectionStart.row, this.selectionStart.column, true);
      this.setHandlePosition(this.endHandle, this.selectionEnd.row, this.selectionEnd.column, false);
    }
  }

  // Desktop double/triple click helpers
  _selectWordAt({ row, column }) {
    // Try to read the buffer line; gracefully fallback
    try {
      const lineObj = this.terminal.buffer.active.getLine(row);
      const line = lineObj ? lineObj.translateToString(true) : '';
      if (!line || column >= line.length) {
        this.startSelection(row, column);
        this.isSelecting = false;
        return;
      }

      // Define word characters: letters, numbers, underscore. Treat others as separators.
      const isWordChar = (ch) => /\w/.test(ch);

      let startCol = column;
      let endCol = column;

      while (startCol > 0 && isWordChar(line[startCol - 1])) startCol--;
      while (endCol < line.length - 1 && isWordChar(line[endCol + 1])) endCol++;

      this.selectionStart = { row, column: Math.max(0, startCol) };
      this.selectionEnd = { row, column: Math.max(0, Math.min(endCol, this.terminal.cols - 1)) };
      this.isSelecting = true;
      this.updateSelection();
      this.isSelecting = false;
      this.showHandles();
    } catch {
      this.startSelection(row, column);
      this.isSelecting = false;
    }
  }

  _selectLineAt({ row }) {
    this.selectionStart = { row, column: 0 };
    this.selectionEnd = { row, column: this.terminal.cols - 1 };
    this.isSelecting = true;
    this.updateSelection();
    this.isSelecting = false;
    this.showHandles();
  }

  // Cleanup
  destroy() {
    if (!this.terminal) return;

    // Remove terminal pointer listeners
    this.terminal.element?.removeEventListener('pointerdown', this._boundPointerDown);
    this.terminal.element?.removeEventListener('pointermove', this._boundPointerMove);
    document.removeEventListener('pointerup', this._boundPointerUp);

    // Remove handle listeners
    if (this.startHandle) {
      this.startHandle.removeEventListener('pointerdown', this._boundStartHandlePointerDown);
      this.startHandle.removeEventListener('pointermove', this._boundHandlePointerMove);
      this.startHandle.removeEventListener('pointerup', this._boundHandlePointerUp);
    }
    if (this.endHandle) {
      this.endHandle.removeEventListener('pointerdown', this._boundEndHandlePointerDown);
      this.endHandle.removeEventListener('pointermove', this._boundHandlePointerMove);
      this.endHandle.removeEventListener('pointerup', this._boundHandlePointerUp);
    }

    // Selection change disposables
    try { this._onSelectionChangeDisposable?.dispose?.(); } catch {}
    try { this._onScrollDisposable?.dispose?.(); } catch {}
    try { this._onResizeDisposable?.dispose?.(); } catch {}

    // Outside click and resize
    document.removeEventListener('pointerdown', this._boundRemoveSelection);
    window.removeEventListener('resize', this._boundOnResize);

    // Remove handles
    if (this.startHandle?.parentNode) this.startHandle.parentNode.removeChild(this.startHandle);
    if (this.endHandle?.parentNode) this.endHandle.parentNode.removeChild(this.endHandle);

    // Timeouts
    clearTimeout(this.tapHoldTimeout);

    // Reset CSS hint
    this.terminalContainer?.classList?.remove('terminal-selecting');

    // Clear refs
    this.terminal = null;
    this.terminalContainer = null;
    this.startHandle = null;
    this.endHandle = null;
    this.selectionStart = null;
    this.selectionEnd = null;
    this._selectionAnchor = null;
    this._activeHandle = null;
  }
}