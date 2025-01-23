/**
 * Copyright (c) 2012-2024, Arnaud MENGUS (MIT License)
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
        let url = "js2ios://";
        let callInfo = {};
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

        // TODO : Replace with -> https://github.com/xtermjs/xterm.js/tree/master/addons/addon-clipboard
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

        if (!terminalSettings.fixedSize) {
            fitAddon.fit();
        }

        JS2IOS.calliOSFunction('notifyTerminalSize', [terminal.cols, terminal.rows]);
    }
};

const ColorHelper = {
    // https://stackoverflow.com/q/35239990
    parseColor: function (color) {
        let x = document.createElement('div');
        document.body.appendChild(x);
        let red = 0, green = 0, blue = 0, alpha = 0;
        try {
            x.style = 'color: ' + color + '!important';
            color = window.getComputedStyle(x).color
            let rgba = color.match(/rgba?\((.*)\)/)[1].split(',').map(Number);
            red = rgba[0];
            green = rgba[1];
            blue = rgba[2];
            alpha = '3' in rgba ? rgba[3] : 1;
        } catch (e) {
        }

        x.parentNode.removeChild(x);

        return { 'red': red, 'green': green, 'blue': blue, 'alpha': alpha };
    },

    // https://stackoverflow.com/q/35239990
    rgbToHex: function (r, g, b) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    },

    invertColor: function (hex) {
        let color = ColorHelper.parseColor(hex);
        let r = 255 - color.red;
        let g = 255 - color.green;
        let b = 255 - color.blue;

        return ColorHelper.rgbToHex(r, g, b);
    },
};

const TerminalHelper = {
    scrolly: null,
    lastSelectedText: null,
    cursorBlinkInterval: null,

    ready: function () {
        // Applying a border to the terminal screen if fixedSize enabled :
        if (terminalSettings.fixedSize) {
            let xtermScreenStyle = document.querySelector('div.xterm-screen').style;
            xtermScreenStyle.border = '1px solid rgba(127,127,127,0.2)';
            xtermScreenStyle.borderStyle = 'none solid solid none';

            setTimeout(function () {
                TerminalHelper.changeFontSize(TerminalHelper.retriveFontSize());
            }, 500);
        }

        terminal.onData(function (data) {
            JS2IOS.calliOSFunction('dataPushBack', data);
        });

        terminal.onBinary(function (data) {
            console.log('On Binary Called');
        });

        // Notify that all components are now ready :
        JS2IOS.calliOSFunction('notifyTerminalReady');
    },

    setWebViewTitle: function (title) {
        document.title = title;
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

    exportBuffer: function (exportType) {
        let exportResult = '';
        switch (exportType) {
            case 'html':
                let htmlOutput = serializeAddon.serializeAsHTML({
                    includeGlobalBackground: true
                });
                let styles = `
                    html, body, pre { 
                        margin: 0; 
                    } 
                    pre>div { 
                        padding:5px;
                    } 
                    * { 
                        font-family: monospace !important
                    }
                `;
                exportResult = htmlOutput.replace(
                    '<html>',
                    `<html><head><style>${styles}</style></head>`
                );
                break;
            case 'txt':
                exportResult = TerminalHelper.exportScrollback();
                break;
            default:
                exportResult = exportResult = serializeAddon.serialize();
        }
        JS2IOS.calliOSFunction('exportBuffer', {
            exportContent: Base64.utoa(exportResult),
            exportType: exportType
        });
    },

    focus: function (enable) {
        const focusEvent = new CustomEvent(enable ? "focus" : "blur", {});
        terminal.textarea.dispatchEvent(focusEvent);
    },

    enableCursorBlink: function (enable) {
        const renderType = TerminalHelper.getRenderType();
        if ('disabled' == terminalSettings.cursorBlink) {
            enable = false;
        }

        if (TerminalHelper.cursorBlinkInterval) {
            clearInterval(TerminalHelper.cursorBlinkInterval);
        }
        TerminalHelper.cursorBlinkInterval = setInterval(function () {
            terminal._core.optionsService.options.cursorBlink = enable;

            // #974 : Upgrade xterm.js to 5.3.0 ->
            if (terminal._core._coreBrowserService) {
                terminal._core._coreBrowserService.isFocused = enable;
                terminal._core._coreBrowserService._cachedIsFocused = true;
            }
            if ('DOM' === renderType) {
                document.querySelector('span.xterm-cursor').classList.add('xterm-cursor-blink');
                document.querySelector('div.xterm-rows').classList.add('xterm-focus');
            }
            // <- #974 : Upgrade xterm.js to 5.3.0

            if (terminal.textarea) {
                TerminalHelper.focus(enable);
            }
        }, 1500);
    },

    scrollToBottom: function () {
        terminal.scrollToBottom();
    },

    getWindowSelectedText: function () {
        if (window.getSelection) {
            return window.getSelection();
        }

        if (window.document.getSelection) {
            return window.document.getSelection();
        }

        if (window.document.selection) {
            return window.document.selection.createRange().text;
        }

        return "";
    },

    copySelectedText: function () {
        if (TerminalHelper.lastSelectedText == null) {
            return;
        }

        JS2IOS.calliOSFunction('notifyCopyTextSelection', [Base64.utoa(TerminalHelper.lastSelectedText)]);
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

    getRenderType: function () {
        const hasWebGLAddon = terminal._addonManager._addons.some(
            addon => addon.instance && addon.instance._addonType === "WebglAddon"
        );
        return hasWebGLAddon ? "WEBGL" : "DOM";
    },

    exportRawScreenRows: function () {
        const renderType = TerminalHelper.getRenderType();
        if ('DOM' === renderType) {
            return {
                rows: Array.from(document.querySelectorAll('div.xterm-rows div')).map((element, index) => {
                    return element.textContent.trim();
                }),
                lineHeight: parseInt(document.querySelector('div.xterm-rows div').style.lineHeight, 10)
            };
        } else {
            const startRow = terminal._core._bufferService.buffer.ydisp;
            const endRow = startRow + terminal.rows;
            let rows = [];
            for (let rowIndex = startRow; rowIndex < endRow; rowIndex++) {
                let rawRow = terminal._core._bufferService.buffer.translateBufferLineToString(rowIndex).trim();
                rows.push(rawRow);
            }
            return {
                rows,
                lineHeight: parseInt(document.querySelector('div.xterm-screen').style.height, 10) / rows.length
            };
        }
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
        TerminalHelper.lastSelectedText = TerminalHelper.exportSelectedText();

        if (terminalSettings.copyOnSelect) {
            TerminalHelper.copySelectedText();
        }
    },

    documentFragmentToText: function (documentFragment) {
        let text = '';

        documentFragment.childNodes.forEach(function (parentChild) {
            if (parentChild.tagName == 'SPAN') {
                text += parentChild.innerText;
            } else if (parentChild.tagName == 'DIV') {
                text += TerminalHelper.documentFragmentToText(parentChild) + '\n';
            }
        });

        return text;
    },

    onNativeSelectionChange: function () {
        let selectedContents = window.getSelection().getRangeAt(0).cloneContents();
        TerminalHelper.lastSelectedText = TerminalHelper.documentFragmentToText(selectedContents);

        if (terminalSettings.copyOnSelect) {
            TerminalHelper.copySelectedText();
        }
    },

    logError: function (event) {
        const errorLoggingStrategy = 'REPORT'; // REPORT or ALERT

        let msg = event.message;
        let source = event.filename;
        let lineno = event.lineno;
        let colno = event.colno;
        let error = event.error;
        let time = event.time;

        let errorLog = msg + ' : ' + error + ' : ' + lineno;

        if ('ALERT' == errorLoggingStrategy) {
            alert(errorLog);
        }

        JS2IOS.calliOSFunction('logError', errorLog);
    },

    retriveFontSize: function () {
        return parseInt(terminal.options.fontSize, 10);
    },

    changeFontSize: function (size) {
        terminal.options.fontSize = size;

        setTimeout(function () {
            ResizeHelper.onWindowResize();

            setTimeout(function () {
                TerminalHelper.scrollToBottom();
            }, 100);
        }, 100);
    },

    extractTerminalSettings: function (hashString) {
        let fragmentJson = atob(hashString.replace('#', ''));
        let fragment = {};

        if (fragmentJson) {
            try {
                fragment = JSON.parse(fragmentJson);
            } catch (e) {
                alert(e);
            }
        }

        let terminalSettings = {
            theme: {},
            fontSize: 9,
            reverseWraparound: true,
            isMacOS: false,
            scrollback: 1000,
            fontFamily: '"Cascadia Code", Menlo, monospace',
            copyOnSelect: false,
            cursorStyle: 'block',
            cursorInactiveStyle: 'outline',
            cursorBlink: 'normal',
            rows: 25,
            cols: 80,
            fixedSize: false,
            handedness: 'right',
            remoteCharacterSet: 'UTF-8',
        }

        if (fragment.fontSize) {
            terminalSettings.fontSize = fragment.fontSize;
        }

        if (fragment.reverseWraparound) {
            terminalSettings.reverseWraparound = fragment.reverseWraparound;
        }

        if (fragment.operatingSystem && fragment.operatingSystem == 'macOS') {
            terminalSettings.isMacOS = true;
        }

        if (fragment.remoteCharacterSet) {
            terminalSettings.remoteCharacterSet = fragment.remoteCharacterSet;
        }

        if (fragment.scrollback) {
            terminalSettings.scrollback = fragment.scrollback;
        }

        if (fragment.fontFamily) {
            terminalSettings.fontFamily = fragment.fontFamily;
            TerminalHelper.loadFont(terminalSettings.fontFamily);
        }

        if (fragment.textSelectionStrategy && fragment.textSelectionStrategy == 'clipboard') {
            terminalSettings.copyOnSelect = true;
        }

        if (fragment.cursorStyle) {
            terminalSettings.cursorStyle = fragment.cursorStyle;
            terminalSettings.cursorInactiveStyle = fragment.cursorStyle;
        }

        if (fragment.cursorBlink) {
            terminalSettings.cursorBlink = fragment.cursorBlink;
        }

        if (fragment.handedness) {
            terminalSettings.handedness = fragment.handedness;
        }

        if (fragment.terminalSize) {
            let regex = /(?<cols>[0-9]+)x(?<rows>[0-9]+)/g;
            let match = regex.exec(fragment.terminalSize);

            if (match) {
                let cols = parseInt(match.groups['cols'], 10);
                let rows = parseInt(match.groups['rows'], 10);

                terminalSettings.cols = cols;
                terminalSettings.rows = rows;
                terminalSettings.fixedSize = true;
            }
        }

        if (fragment.theme) {
            terminalSettings.theme = JSON.parse(fragment.theme);
        }

        return terminalSettings;
    },

    applyTheme: function (theme) {
        terminal._publicOptions.theme = theme;

        if (theme.background) {
            document.querySelector('body').style.backgroundColor = theme.background;
        }

        // TODO : Ability to update Font Family on a running terminal:
        /*if (theme._fontFamilyName) {
            TerminalHelper.loadFont(theme._fontFamilyName, () => {
                terminal._publicOptions.fontFamily = theme._fontFamilyName;
            });
        } else {
            terminal._publicOptions.fontFamily = '"MesloLGS NF"';
        }*/
    },

    buildTheme: function (terminalSettings) {
        let theme = terminalSettings.theme;
        theme.cursor = theme.cursorColor;
        theme.cursorAccent = theme.background;
        //theme.selectionForeground = ColorHelper.invertColor(theme.foreground);
        theme.selectionInactiveBackground = ColorHelper.invertColor(theme.background);

        // #1173 Theme : Purple color should be named Magenta (ANSI) ->
        theme.magenta = theme.purple;
        theme.brightMagenta = theme.brightPurple;
        // <- #1173 Theme : Purple color should be named Magenta (ANSI)

        return theme;
    },

    buildTerminalSettings: function (terminalSettings) {
        return {
            fontFamily: terminalSettings.fontFamily,
            allowTransparency: true,
            bellStyle: 'none',
            theme: TerminalHelper.buildTheme(terminalSettings),
            fontSize: terminalSettings.fontSize,
            fontWeight: 'normal',
            fontWeightBold: 'normal',
            cursorStyle: terminalSettings.cursorStyle,
            cursorInactiveStyle: terminalSettings.cursorStyle,
            customGlyphs: true,
            scrollback: terminalSettings.scrollback,
            rows: terminalSettings.rows,
            cols: terminalSettings.cols,
            macOptionClickForcesSelection: true,
        };
    },

    loadFont: function (fontFamily, callback) {
        var fontStyle = document.createElement('style');
        fontStyle.appendChild(document.createTextNode("\
        @font-face {\
            font-family: " + fontFamily + ";\
            src: url('font://webssh/" + fontFamily + ".woff2') format('woff2');\
            font-weight: normal;\
            font-style: normal;\
            font-display: swap;\
        }\
        "));
        document.head.appendChild(fontStyle);

        // Use the FontFaceSet API to check when the font is loaded :
        document.fonts.load(`16px "${fontFamily}"`).then(() => {
            console.log(`Font ${fontFamily} loaded successfully`);
            if (callback) {
                callback();
            }
        }).catch((error) => {
            console.error(`Failed to load font ${fontFamily}:`, error);
        });
    },

    onBufferChange: function (buffer) {
        // Hide Scrolly when alternate buffer is active :
        buffer.type === 'alternate' ? TerminalHelper.scrolly.hide() : TerminalHelper.scrolly.show();

        // Inform WebSSH that the buffer has changed :
        JS2IOS.calliOSFunction('notifyBufferChange', buffer.type);
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

        } else {
            // Only if alternate buffer is active :
            if (terminal.buffer.active.type == 'alternate') {
            }
        }
    },

    registerHandlers: function () {
        HandlerHelper.registerAll(terminal);
    },

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