/**
 * Copyright (c) 2012-2023, Arnaud MENGUS (MIT License)
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

// https://www.joshwcomeau.com/snippets/javascript/debounce/
const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
};

const JS2IOS = {
    calliOSFunction: function (functionName, args) {
        var url = "js2ios://";

        var callInfo = {};
        callInfo.functionname = functionName;

        if (args) {
            callInfo.args = args;
        }

        url += JSON.stringify(callInfo)

        if (window.webkit &&
            window.webkit.messageHandlers &&
            window.webkit.messageHandlers.JS2IOS) {
            window.webkit.messageHandlers.JS2IOS.postMessage(url);
        } else {
            console.log(url);
        }
    }
};

const HandlerHelper = {
    // https://xtermjs.org/docs/guides/hooks/
    registerAll: function (terminal) {
        // CSI ->
        // Wikipedia : https://en.wikipedia.org/wiki/ANSI_escape_code
        // * For Control Sequence Introducer, or CSI, commands, the ESC [ is followed by any number (including none) of "parameter bytes" in the range 0x30–0x3F (ASCII 0–9:;<=>?), then by any number of "intermediate bytes" in the range 0x20–0x2F (ASCII space and !"#$%&'()*+,-./), then finally by a single "final byte" in the range 0x40–0x7E (ASCII @A–Z[\]^_`a–z{|}~).
        // * All common sequences just use the parameters as a series of semicolon-separated numbers such as 1;2;3. Missing numbers are treated as 0 (1;;3 acts like the middle number is 0, and no parameters at all in ESC[m acts like a 0 reset code). Some sequences (such as CUU) treat 0 as 1 in order to make missing parameters useful.
        // * A subset of arrangements was declared "private" so that terminal manufacturers could insert their own sequences without conflicting with the standard. Sequences containing the parameter bytes <=>? or the final bytes 0x70–0x7E (p–z{|}~) are private.
        // * The behavior of the terminal is undefined in the case where a CSI sequence contains any character outside of the range 0x20–0x7E. These illegal characters are either C0 control characters (the range 0–0x1F), DEL (0x7F), or bytes with the high bit set. Possible responses are to ignore the byte, to process it immediately, and furthermore whether to continue with the CSI sequence, to abort it immediately, or to ignore the rest of it.

        // \x1b[6n => report cursor position
        terminal.parser.registerCsiHandler({ final: 'n' }, (params, data) => {
            if (params.length == 1 && params[0] == 6) {
                TerminalHelper.sendCursorPosToServer();
            }
        });
        // <- CSI

        // DCS ->
        // Wikipedia : https://en.wikipedia.org/wiki/ANSI_escape_code
        // * Terminated by ST.[5]: 5.6  Xterm's uses of this sequence include defining User-Defined Keys, and requesting or setting Termcap/Terminfo data.

        terminal.parser.registerDcsHandler({ prefix: '?', final: 'w' }, (data, params) => {
            // POC : console.log(params, data);
        });
        // <- DCS

        // OSC ->
        // Wikipedia : https://en.wikipedia.org/wiki/ANSI_escape_code
        // * Terminated by BEL or ST.

        // OSC52 is a terminal escape sequence that allows copying text to the clipboard from the terminal. It is supported by many terminal emulators, including xterm, gnome-terminal, and iTerm2.
        terminal.parser.registerOscHandler(52, (data, params) => {
            // Documentation :
            // * https://github.com/xtermjs/xterm.js/issues/3260
            // * https://golangexample.com/copy-text-to-the-system-clipboard-from-anywhere-using-the-ansi-osc52-sequence/
            // * https://github.com/ojroques/vim-oscyank/blob/main/README.md
            // * https://chromium.googlesource.com/apps/libapps/+/a5fb83c190aa9d74f4a9bca233dac6be2664e9e9/hterm/doc/ControlSequences.md#osc
            // * https://github.com/aymanbagabas/shcopy/blob/master/main.go
            // * https://github.com/aymanbagabas/go-osc52/blob/master/osc52.go
            // * https://invisible-island.net/xterm/ctlseqs/ctlseqs.html#h3-Operating-System-Commands
            // * https://github.com/tmux/tmux/wiki/Clipboard
            // * https://www.freecodecamp.org/news/tmux-in-practice-integration-with-system-clipboard-bcd72c62ff7b/

            // The sequence consists of the following:
            // OSC 52 ; Pc ; Pd BEL
            // Pc is the clipboard choice:
            //	c: clipboard
            //	p: primary (not supported)
            //	q: secondary (not supported)
            //	s: select (not supported)
            //	0-7: cut-buffers (not supported)
            // Pd is the data to copy to the clipboard. This string should be encoded in base64 (RFC-4648).
            // If Pd is "?", the terminal replies to the host with the current contents of the clipboard.
            // If Pd is neither a base64 string nor "?", the terminal clears the clipboard.
            // See https://invisible-island.net/xterm/ctlseqs/ctlseqs.html#h3-Operating-System-Commands (where Ps = 52 => Manipulate Selection Data)
            const dataParts = data.split(';');

            if (dataParts.length != 2) {
                return;
            }

            const pc = dataParts[0];
            const pd = dataParts[1];

            switch (pc) {
                case 'c':
                    if (pd == '?') {
                        // TODO : Ask user if we can access (read) the clipboard :
                        // TODO JS2IOS.calliOSFunction('askAndSendClipboardToServer', TerminalHelper.getClipboard());
                    }
                    else {
                        TerminalHelper.setClipboardFromOSC52(pd);
                    }
                    break;
                default:
                    break;
            }
        });
        // <- OSC
    }
};

const ResizeHelper = {
    init: function () {
        // Resize terminal on init :
        ResizeHelper.onWindowResize();

        // Resize terminal on startup :
        [100, 500, 1000, 2000].forEach(function (timeout) {
            setTimeout(ResizeHelper.onWindowResize, timeout);
        });

        // Resize terminal when resizing window :
        window.addEventListener('resize', ResizeHelper.onWindowResize, false);
    },

    onWindowResize: debounce(() => {
        ResizeHelper.notifyTerminalSize();
    }, 250),

    notifyTerminalSize: function () {
        // Hack -> Don't use scrollbar width in order to use all columns on screen :
        terminal._core.viewport.scrollBarWidth = 0;

        fitAddon.fit();
        JS2IOS.calliOSFunction('notifyTerminalSize', [terminal.cols, terminal.rows]);
    }
};

const TerminalHelper = {
    scrolly: null,

    ready: function () {
        // Applying a border to the terminal screen if fixedSize enabled :
        if (terminalSettings.fixedSize) {
            let xtermScreenStyle = document.querySelector('div.xterm-screen').style;
            xtermScreenStyle.border = '1px solid rgba(127,127,127,0.2)';
            xtermScreenStyle.borderStyle = 'none solid solid none';
        }

        // Notify that all components are now ready :
        JS2IOS.calliOSFunction('notifyTerminalReady');

        // Every 60 seconds, save terminal state :
        setInterval(TerminalHelper.saveState, 60000);
    },

    saveState: debounce(() => {
        const encodedContent = Base64.btoa(encodeURIComponent(serializeAddon.serialize({
            scrollback: 1000,
            excludeModes: false,
            excludeAltBuffer: false
        })));
        JS2IOS.calliOSFunction('saveState', encodedContent);
    }, 1000),

    restoreState: function (encodedContent) {
        terminal.write(decodeURIComponent(atob(encodedContent)));
    },

    focus: function (enable) {
        const focusEvent = new CustomEvent(enable ? "focus" : "blur", {});
        terminal.textarea.dispatchEvent(focusEvent);
    },

    enableCursorBlink: function (enable) {
        if ('disabled' == terminalSettings.cursorBlink) {
            enable = false;
        }

        terminal._core.optionsService.options.cursorBlink = enable;
        
        if (terminal.textarea) {
            TerminalHelper.focus(enable);
        }
    },

    scrollToBottom: function () {
        terminal.scrollToBottom();
    },

    copySelectedText: function () {
        const textSelection = TerminalHelper.exportSelectedText();

        JS2IOS.calliOSFunction('notifyCopyTextSelection', [Base64.utoa(textSelection)]);
    },

    selectAll: function () {
        terminal.selectAll();
    },

    selectScreen: function () {
        const startRow = terminal._core._bufferService.buffer.ydisp;
        const endRow = startRow + terminal.rows;
        terminal.selectLines(startRow, endRow);
    },

    clearSelection: function () {
        terminal.clearSelection();
    },

    exportSelectedText: function () {
        return terminal.getSelection();
    },

    exportScrollback: function () {
        terminal.selectAll();
        const textSelection = TerminalHelper.exportSelectedText();
        terminal.clearSelection();

        return textSelection;
    },

    onBell: debounce(() => {
        JS2IOS.calliOSFunction('notifyTerminalBell');
    }, 250),

    getCursorPosition: function () {
        return [terminal.buffer.active.cursorX, terminal.buffer.active.cursorY];
    },

    onTitleChange: debounce((title) => {
        JS2IOS.calliOSFunction('notifyTerminalTitle', Base64.btoa(title));
    }, 250),

    onSelectionChange: function () {
        if (terminalSettings.copyOnSelect) {
            TerminalHelper.copySelectedText();
        }
    },

    logError: function (event) {
        let msg = source = lineno = colno = error = time = "";
        msg = event.message;
        source = event.filename;
        lineno = event.lineno;
        colno = event.colno;
        error = event.error;
        time = event.time;

        alert(msg + ' : ' + error + ' : ' + lineno);
    },

    changeFontSize: function (size) {
        terminal.setOption('fontSize', size);

        setTimeout(function () {
            ResizeHelper.onWindowResize();

            setTimeout(function () {
                TerminalHelper.scrollToBottom();
            }, 100);
        }, 100);
    },

    extractTerminalSettings: function (hashString) {
        let fragment = atob(hashString.replace('#', ''));
        let fragmentsParts = fragment.split(';');

        let terminalSettings = {
            backgroundColor: '#2e3436',
            foregroundColor: '#ffffff',
            cursorColor: '#119cf3',
            fontSize: 9,
            reverseWraparound: true,
            isMacOS: true,
            scrollback: 1000,
            fontFamily: '"Cascadia Code", Menlo, monospace',
            copyOnSelect: false,
            cursorStyle: 'block',
            cursorBlink: 'normal',
            rows: 25,
            cols: 80,
            fixedSize: false,
        }

        for (let i in fragmentsParts) {
            let fragmentParts = fragmentsParts[i].split('=');
            let fragmentName = fragmentParts[0];
            let fragmentValue = fragmentParts[1];

            if ('BC' == fragmentName) {
                terminalSettings.backgroundColor = fragmentValue;

            } else if ('FC' == fragmentName) {
                terminalSettings.foregroundColor = fragmentValue;

            } else if ('CC' == fragmentName) {
                terminalSettings.cursorColor = fragmentValue;

            } else if ('FS' == fragmentName) {
                terminalSettings.fontSize = fragmentValue;

            } else if ('RW' == fragmentName) {
                terminalSettings.reverseWraparound = fragmentValue == "enabled" ? true : false;

            } else if ('OS' == fragmentName) {
                terminalSettings.isMacOS = fragmentValue == "macOS" ? true : false;

            } else if ('SB' == fragmentName) {
                terminalSettings.scrollback = fragmentValue;

            } else if ('FF' == fragmentName) {
                terminalSettings.fontFamily = fragmentValue;

            } else if ('CS' == fragmentName) {
                terminalSettings.copyOnSelect = fragmentValue == "clipboard" ? true : false;

            } else if ('CU' == fragmentName) {
                terminalSettings.cursorStyle = fragmentValue;

            } else if ('CB' == fragmentName) {
                terminalSettings.cursorBlink = fragmentValue;

            } else if ('TS' == fragmentName) {
                let regex = /(?<cols>[0-9]+)x(?<rows>[0-9]+)/g;
                let match = regex.exec(fragmentValue);

                if (match) {
                    let cols = parseInt(match.groups['cols'], 10);
                    let rows = parseInt(match.groups['rows'], 10);

                    terminalSettings.cols = cols;
                    terminalSettings.rows = rows;
                    terminalSettings.fixedSize = true;
                }
            }
        }

        return terminalSettings;
    },

    buildTheme: function (terminalSettings) {
        return {
            background: terminalSettings.backgroundColor,
            foreground: terminalSettings.foregroundColor,
            cursor: terminalSettings.cursorColor,
            cursorAccent: terminalSettings.backgroundColor
        };
    },

    buildTerminalSettings: function (terminalSettings) {
        return {
            fontFamily: terminalSettings.fontFamily,
            rendererType: 'dom',
            allowTransparency: true,
            bellStyle: 'none',
            theme: TerminalHelper.buildTheme(terminalSettings),
            fontSize: terminalSettings.fontSize,
            fontWeight: 'normal',
            fontWeightBold: 'normal',
            cursorStyle: terminalSettings.cursorStyle,
            customGlyphs: true,
            scrollback: terminalSettings.scrollback,
            rows: terminalSettings.rows,
            cols: terminalSettings.cols,
        };
    },

    onBufferChange: function (buffer) {
        buffer.type === 'alternate' ? TerminalHelper.scrolly.hide() : TerminalHelper.scrolly.show();
    },

    changeTouchMode: function (touchMode) {
        const xtermScreen = document.querySelector('.xterm-screen');

        switch (touchMode) {
            case 'select':
                xtermScreen.addEventListener("touchstart", TouchHelper.touchHandler, true);
                xtermScreen.addEventListener("touchmove", TouchHelper.touchHandler, true);
                xtermScreen.addEventListener("touchend", TouchHelper.touchHandler, true);
                xtermScreen.addEventListener("touchcancel", TouchHelper.touchHandler, true);
                break;

            case 'scroll':
                xtermScreen.removeEventListener("touchstart", TouchHelper.touchHandler, true);
                xtermScreen.removeEventListener("touchmove", TouchHelper.touchHandler, true);
                xtermScreen.removeEventListener("touchend", TouchHelper.touchHandler, true);
                xtermScreen.removeEventListener("touchcancel", TouchHelper.touchHandler, true);
                break;

            default:
                return;
        }
    },

    clickListener: function (event) {
        if (event.button == 0 && event.metaKey) { // Cmd + Left Click => Want to paste content from clipboard
            JS2IOS.calliOSFunction('pasteClipboardContent');
        }
    },

    registerHandlers: function () {
        HandlerHelper.registerAll(terminal);
    },

    sendCursorPosToServer: debounce(() => {
        JS2IOS.calliOSFunction('sendCursorPosToServer', TerminalHelper.getCursorPosition());
    }, 250),

    setClipboardFromOSC52: debounce((pd) => {
        JS2IOS.calliOSFunction('setClipboardFromOSC52', pd);
    }, 250),

    onLinkClick: function (event, uri) {
        JS2IOS.calliOSFunction('openLink', uri);
    },

    pocTest: function () {
        /*const term = terminal;
            term.options['overviewRulerWidth'] = 15;
            term.registerDecoration({marker: term.registerMarker(1), overviewRulerOptions: { color: '#ef2929' }});
            term.registerDecoration({marker: term.registerMarker(3), overviewRulerOptions: { color: '#8ae234' }});
            term.registerDecoration({marker: term.registerMarker(5), overviewRulerOptions: { color: '#729fcf' }});
            term.registerDecoration({marker: term.registerMarker(7), overviewRulerOptions: { color: '#ef2929', position: 'left' }});
            term.registerDecoration({marker: term.registerMarker(7), overviewRulerOptions: { color: '#8ae234', position: 'center' }});
            term.registerDecoration({marker: term.registerMarker(7), overviewRulerOptions: { color: '#729fcf', position: 'right' }});
            term.registerDecoration({marker: term.registerMarker(10), overviewRulerOptions: { color: '#8ae234', position: 'center' }});
            term.registerDecoration({marker: term.registerMarker(10), overviewRulerOptions: { color: '#ff0000', position: 'full' }});


            const marker = term.registerMarker(1);
            const decoration = term.registerDecoration({
                marker,
                backgroundColor: '#FF0000',
                foregroundColor: '#FFFFFF',
                overviewRulerOptions: { color: '#0000FF', position: 'left' }
            });
            //decoration.onRender(e => {
            //    e.style.right = '100%';
            //    e.style.backgroundColor = '#ef292980';
            //});

            searchAddon.findNext('ok', {
                regex: false,
                wholeWord: false,
                caseSensitive: false,
                incremental: false,
                decorations: {
                    matchBackground: '#0000FF',
                    matchBorder: '#00FF00',
                    matchOverviewRuler: 'orange',
                    activeMatchBackground: '#FFFF00',
                    activeMatchBorder: '#0000FF',
                    activeMatchColorOverviewRuler: 'orange'
                }
            });*/
    }
};

const TouchHelper = {
    // Based on : https://stackoverflow.com/a/1781750
    touchHandler: function (event) {
        var touches = event.changedTouches,
            first = touches[0],
            type = "";
        switch (event.type) {
            case "touchstart": type = "mousedown"; break;
            case "touchmove": type = "mousemove"; break;
            case "touchend": type = "mouseup"; break;
            default: return;
        }

        // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
        //                screenX, screenY, clientX, clientY, ctrlKey, 
        //                altKey, shiftKey, metaKey, button, relatedTarget);

        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
            first.screenX, first.screenY,
            first.clientX, first.clientY, false,
            false, false, false, 0/*left*/, null);

        first.target.dispatchEvent(simulatedEvent);

        // We don't want to prevent default behaviour (OS handling, long press...)
        // So this line is commented :
        //event.preventDefault();

        // We don't want to propagate the event to the terminal :
        event.stopPropagation();
    }
};
