// MIT License
// Original Work Copyright (c) 2023 Raunak Raj : https://github.com/bajrangCoder/acode-plugin-acodex
// Upgraded Work Copyright (c) 2025 Arnaud MENGUS : https://github.com/isontheline/pro.webssh.net
class SelectionHandlesAddon {
  isSelecting = false;
  isTapAndHoldActive = false;
  tapHoldTimeout = null;
  selectionStart = null;
  selectionEnd = null;
  touchStartY = 0;
  touchStartX = 0;
  touchStartTime = 0;
  scrollThreshold = 10; // pixels
  scrollTimeThreshold = 100; // milliseconds
  touchMoveThreshold = 5; // pixels - to prevent accidental selections
  handleSize = 20;

  // references to DOM elements
  terminal = null;
  terminalContainer = null;
  startHandle = null;
  endHandle = null;

  // Addon configuration
  settings = {
    selectionHaptics: true
  };

  constructor(options = {}) {
    // Allow configuration through constructor
    this.settings = { ...this.settings, ...options };
  }

  /**
   * Activate the addon (called by xterm.js)
   * @param {Terminal} terminal - The xterm.js terminal instance
   */
  activate(terminal) {
    this.terminal = terminal;

    // Wait for terminal to be ready (element needs to be created via open())
    if (!terminal.element) {
      console.error('Terminal element not found. Make sure to call terminal.open() before loading addons.');
      return;
    }

    // Find the terminal container - xterm.js uses the parent element
    this.terminalContainer = terminal.element.parentElement;

    if (!this.terminalContainer) {
      console.error('Terminal container not found');
      return;
    }

    // Create handles
    this._createHandles();
    this._attachEventListeners();
  }

  /**
   * Dispose the addon (called by xterm.js)
   */
  dispose() {
    this.destroy();
  }

  /**
   * Create teardrop selection handles
   */
  _createHandles() {
    // Create start handle
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

    // Create end handle
    this.endHandle = document.createElement("div");
    this.endHandle.className = "terminal-selection-handle end-handle";
    this.endHandle.style.cssText = styleText;

    // Append handles to the terminal container
    this.terminalContainer.appendChild(this.startHandle);
    this.terminalContainer.appendChild(this.endHandle);
  }

  /**
   * Attach all necessary event listeners
   */
  _attachEventListeners() {
    this._boundTerminalTouchStart = this.terminalTouchStartCb.bind(this);
    this.terminal.element.addEventListener(
      "touchstart",
      this._boundTerminalTouchStart,
      { passive: false }
    );

    this._boundTerminalTouchMove = this.terminalTouchMoveCb.bind(this);
    this.terminal.element.addEventListener(
      "touchmove",
      this._boundTerminalTouchMove,
      { passive: false }
    );

    this._boundTerminalTouchEnd = this.terminalTouchEndCb.bind(this);
    this.terminal.element.addEventListener(
      "touchend",
      this._boundTerminalTouchEnd
    );

    // Handle touch events
    this._boundStartHandleTouchStart = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    this.startHandle.addEventListener(
      "touchstart",
      this._boundStartHandleTouchStart,
      { passive: false }
    );

    this._boundEndHandleTouchStart = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    this.endHandle.addEventListener(
      "touchstart",
      this._boundEndHandleTouchStart,
      { passive: false }
    );

    this._boundStartHandleTouchMove = this.startHandleTouchMoveCb.bind(this);
    this.startHandle.addEventListener(
      "touchmove",
      this._boundStartHandleTouchMove,
      { passive: false }
    );

    this._boundEndHandleTouchMove = this.endHandleTouchMoveCb.bind(this);
    this.endHandle.addEventListener(
      "touchmove",
      this._boundEndHandleTouchMove,
      { passive: false }
    );

    // Selection change event - xterm.js uses onSelectionChange event
    this._boundSelectionChange = () => this.terminalSelectionChangeCb();
    this.terminal.onSelectionChange(this._boundSelectionChange);

    // Click outside to remove selection
    this._boundRemoveSelection = this.removeSelectionCb.bind(this);
    document.addEventListener("touchstart", this._boundRemoveSelection);
  }

  /**
   * Get the cell dimensions from the terminal
   */
  _getCellSize() {
    // Access xterm.js internal render service
    const renderer = this.terminal._core._renderService.dimensions;
    return {
      cellWidth: renderer.css.cell.width,
      cellHeight: renderer.css.cell.height,
    };
  }

  /**
   * Convert touch coordinates to terminal cell coordinates
   */
  getTouchCoordinates(event) {
    if (!event.touches || event.touches.length === 0) return null;

    const rect = this.terminal.element.getBoundingClientRect();
    const touch = event.touches[0];

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const { cellWidth, cellHeight } = this._getCellSize();

    const scrollOffset = this.terminal.buffer.active.viewportY;
    const column = Math.max(
      0,
      Math.min(Math.floor(x / cellWidth), this.terminal.cols - 1)
    );
    const row = Math.max(0, Math.floor(y / cellHeight) + scrollOffset);

    return { row, column };
  }

  /**
   * Calculate handle position with teardrop positioning
   */
  calculateHandlePosition(row, column, isStartHandle) {
    const { cellWidth, cellHeight } = this._getCellSize();
    const terminalRect = this.terminal.element.getBoundingClientRect();
    const containerRect = this.terminalContainer.getBoundingClientRect();

    // Get scroll offsets
    const terminalScrollOffset = this.terminal.element.scrollTop || 0;
    const viewportScrollOffset = this.terminal.buffer.active.viewportY;

    // Adjust row to account for terminal scrolling
    const adjustedRow = row - viewportScrollOffset;

    // Calculate x position - point should be at the edge of selection
    let x;
    if (isStartHandle) {
      x = terminalRect.left + column * cellWidth;
    } else {
      x = terminalRect.left + (column + 1) * cellWidth;
    }

    // Calculate y position - middle of cell
    let y = terminalRect.top + (adjustedRow + 1) * cellHeight - 2;

    // Adjust for container position
    x = x - containerRect.left;
    y = y - containerRect.top;

    // Ensure handles stay within bounds
    x = Math.max(
      this.handleSize / 2,
      Math.min(x, containerRect.width - this.handleSize / 2)
    );
    y = Math.max(
      this.handleSize / 2,
      Math.min(y, containerRect.height - this.handleSize / 2)
    );

    return { x, y };
  }

  /**
   * Set handle position with proper teardrop orientation
   */
  setHandlePosition(handle, row, column, isStartHandle = false) {
    const position = this.calculateHandlePosition(row, column, isStartHandle);

    handle.style.left = `${position.x - this.handleSize / 2}px`;
    handle.style.top = `${position.y - 2}px`;
    handle.style.display = "block";
  }

  /**
   * Hide both selection handles
   */
  hideHandles() {
    this.startHandle.style.display = "none";
    this.endHandle.style.display = "none";
  }

  /**
   * Show both selection handles
   */
  showHandles() {
    if (this.selectionStart && this.selectionEnd) {
      this.setHandlePosition(
        this.startHandle,
        this.selectionStart.row,
        this.selectionStart.column,
        true
      );
      this.setHandlePosition(
        this.endHandle,
        this.selectionEnd.row,
        this.selectionEnd.column,
        false
      );
    }
  }

  /**
   * Start a selection at the given coordinates
   */
  startSelection(row, column) {
    this.selectionStart = { row, column };
    this.selectionEnd = { row, column };
    this.isSelecting = true;

    this.terminal.focus();
    this.terminal.clearSelection();
    this.terminal.select(column, row, 1);

    this.showHandles();
  }

  /**
   * Update the selection based on current start and end points
   */
  updateSelection() {
    if (!this.selectionStart || !this.selectionEnd) return;

    this.terminal.clearSelection();

    let startRow = this.selectionStart.row;
    let startColumn = this.selectionStart.column;
    let endRow = this.selectionEnd.row;
    let endColumn = this.selectionEnd.column;

    // Ensure start is always before end in text flow
    const isSwapped =
      startRow > endRow || (startRow === endRow && startColumn > endColumn);
    if (isSwapped) {
      [startRow, startColumn, endRow, endColumn] = [
        endRow,
        endColumn,
        startRow,
        startColumn,
      ];
    }

    const totalLength = this._calculateTotalSelectionLength(
      startRow,
      endRow,
      startColumn,
      endColumn
    );

    this.terminal.select(startColumn, startRow, totalLength);

    // We need to adjust handle positions based on the actual handles,
    // not the logical selection bounds (for proper teardrop orientation)
    this.setHandlePosition(
      this.startHandle,
      this.selectionStart.row,
      this.selectionStart.column,
      !isSwapped
    );

    this.setHandlePosition(
      this.endHandle,
      this.selectionEnd.row,
      this.selectionEnd.column,
      isSwapped
    );
  }

  /**
   * Calculate the total length of the selection in characters
   */
  _calculateTotalSelectionLength(startRow, endRow, startColumn, endColumn) {
    const terminalCols = this.terminal.cols;

    if (startRow === endRow) {
      return endColumn - startColumn + 1;
    }

    let length = 0;
    length += terminalCols - startColumn; // First row
    length += (endRow - startRow - 1) * terminalCols; // Middle rows
    length += endColumn + 1; // Last row

    return length;
  }

  /**
   * Handle touch move on the start handle
   */
  startHandleTouchMoveCb(event) {
    event.preventDefault();
    event.stopPropagation();

    const coords = this.getTouchCoordinates(event);
    if (!coords) return;

    this.selectionStart = coords;
    this.updateSelection();
  }

  /**
   * Handle touch move on the end handle
   */
  endHandleTouchMoveCb(event) {
    event.preventDefault();
    event.stopPropagation();

    const coords = this.getTouchCoordinates(event);
    if (!coords) return;

    this.selectionEnd = coords;
    this.updateSelection();
  }

  /**
   * Handle touch start on the terminal
   */
  terminalTouchStartCb(event) {
    // Record initial touch position and time for later movement detection
    this.touchStartY = event.touches[0].clientY;
    this.touchStartX = event.touches[0].clientX;
    this.touchStartTime = Date.now();

    // If already selecting, don't set up a new tap-and-hold
    if (this.isSelecting) return;

    const coords = this.getTouchCoordinates(event);
    if (!coords) return;

    this.isTapAndHoldActive = false;

    // Setup tap and hold timer
    clearTimeout(this.tapHoldTimeout);
    this.tapHoldTimeout = setTimeout(() => {
      // Only activate if there hasn't been significant movement
      const currentX = event.touches?.[0]?.clientX || 0;
      const currentY = event.touches?.[0]?.clientY || 0;
      const moveX = Math.abs(currentX - this.touchStartX);
      const moveY = Math.abs(currentY - this.touchStartY);

      if (moveX < this.touchMoveThreshold && moveY < this.touchMoveThreshold) {
        this.isTapAndHoldActive = true;
        this.startSelection(coords.row, coords.column);
        if (this.settings.selectionHaptics && navigator.vibrate) {
          navigator.vibrate(300);
        }
      }
    }, 500);
  }

  /**
   * Handle touch move on the terminal
   */
  terminalTouchMoveCb(event) {
    if (this.isSelecting) {
      event.preventDefault();
      const coords = this.getTouchCoordinates(event);
      if (!coords) return;

      this.selectionEnd = coords;
      this.updateSelection();
    } else {
      // Check if it's a significant movement (likely scrolling)
      const touchMoveX = event.touches[0].clientX;
      const touchMoveY = event.touches[0].clientY;
      const touchMoveDeltaX = Math.abs(touchMoveX - this.touchStartX);
      const touchMoveDeltaY = Math.abs(touchMoveY - this.touchStartY);
      const touchMoveTime = Date.now() - this.touchStartTime;

      // Cancel tap-and-hold if movement detected
      if (
        (touchMoveDeltaX > this.scrollThreshold ||
          touchMoveDeltaY > this.scrollThreshold) &&
        touchMoveTime < this.scrollTimeThreshold
      ) {
        clearTimeout(this.tapHoldTimeout);
      }
    }
  }

  /**
   * Handle touch end on the terminal
   */
  terminalTouchEndCb(event) {
    clearTimeout(this.tapHoldTimeout);

    // Only focus the terminal if we're not selecting
    if (!this.isSelecting) {
      this.terminal.focus();
    }
  }

  /**
   * Handle terminal selection change
   */
  terminalSelectionChangeCb() {
    const selection = this.terminal.getSelection();
    if (selection && selection.length > 0 && this.isSelecting) {
      this.showHandles();
    } else if (!selection || selection.length === 0) {
      this.hideHandles();
      this.isSelecting = false;
    }
  }

  /**
   * Handle touch outside the terminal
   */
  removeSelectionCb(event) {
    // Ignore if touching the handles
    if (
      this.startHandle.contains(event.target) ||
      this.endHandle.contains(event.target)
    ) {
      return;
    }

    // Check if touch is outside terminal
    if (this.terminal && !this.terminal.element.contains(event.target)) {
      this.isSelecting = false;
      this.terminal.clearSelection();
      this.hideHandles();
    }
  }

  /**
   * Update the positions of the selection handles
   */
  updateHandles() {
    if (this.selectionStart && this.selectionEnd) {
      this.setHandlePosition(
        this.startHandle,
        this.selectionStart.row,
        this.selectionStart.column,
        true
      );
      this.setHandlePosition(
        this.endHandle,
        this.selectionEnd.row,
        this.selectionEnd.column,
        false
      );
    }
  }

  /**
   * Clean up event listeners and DOM elements
   */
  destroy() {
    if (!this.terminal) return;

    // Remove event listeners
    if (this.terminal.element) {
      this.terminal.element.removeEventListener(
        "touchstart",
        this._boundTerminalTouchStart
      );
      this.terminal.element.removeEventListener(
        "touchmove",
        this._boundTerminalTouchMove
      );
      this.terminal.element.removeEventListener(
        "touchend",
        this._boundTerminalTouchEnd
      );
    }

    if (this.startHandle) {
      this.startHandle.removeEventListener(
        "touchstart",
        this._boundStartHandleTouchStart
      );
      this.startHandle.removeEventListener(
        "touchmove",
        this._boundStartHandleTouchMove
      );
    }

    if (this.endHandle) {
      this.endHandle.removeEventListener(
        "touchstart",
        this._boundEndHandleTouchStart
      );
      this.endHandle.removeEventListener(
        "touchmove",
        this._boundEndHandleTouchMove
      );
    }

    // Remove selection change callback
    if (this._boundSelectionChange) {
      try {
        this.terminal.onSelectionChange(null);
      } catch (e) {
        console.warn("Could not remove selection change listener", e);
      }
    }

    document.removeEventListener("touchstart", this._boundRemoveSelection);

    // Remove handles from DOM
    if (this.startHandle?.parentNode) {
      this.startHandle.parentNode.removeChild(this.startHandle);
    }
    if (this.endHandle?.parentNode) {
      this.endHandle.parentNode.removeChild(this.endHandle);
    }

    // Clear any pending timeouts
    clearTimeout(this.tapHoldTimeout);

    // Clear references
    this.terminal = null;
    this.terminalContainer = null;
    this.startHandle = null;
    this.endHandle = null;
  }
}