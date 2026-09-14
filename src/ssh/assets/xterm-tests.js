/**
 * Copyright (c) 2022-2025, Arnaud MENGUS (MIT License)
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

const XtermTests = {
    // Scenario registry : each entry writes into the terminal and may return
    // a Promise (timed scenarios). Launch from the Web Inspector console :
    //   XtermTests.launchTests()        SGR + events (synchronous, historical)
    //   XtermTests.run('progress')      one scenario
    //   XtermTests.runAll()             everything, sequentially
    scenarios: {
        // From : https://gist.github.com/iansan5653/c4a0b9f5c30d74258c5f132084b78db9
        sgr: function () {
            terminal.write('\x1b[0m Reset / Normal \x1b[0m\r\n');
            terminal.write('\x1b[1m Bold or increased intensity \x1b[0m\r\n');
            terminal.write('\x1b[2m Faint (decreased intensity) \x1b[0m\r\n');
            terminal.write('\x1b[3m Italic \x1b[0m\r\n');
            terminal.write('\x1b[4m Underline \x1b[0m\r\n');
            terminal.write('\x1b[5m Slow Blink \x1b[0m\r\n');
            terminal.write('\x1b[6m Rapid Blink \x1b[0m\r\n');
            terminal.write('\x1b[7m reverse video \x1b[0m\r\n');
            terminal.write('\x1b[8m Conceal \x1b[0m\r\n');
            terminal.write('\x1b[9m Crossed-out \x1b[0m\r\n');
            terminal.write('\x1b[10m Primary(default) font \x1b[0m\r\n');
            terminal.write('Alternative Fonts:\r\n');
            terminal.write('\t\x1b[11m Alternative font 0\x1b[0m\r\n');
            terminal.write('\t\x1b[12m Alternative font 1\x1b[0m\r\n');
            terminal.write('\t\x1b[13m Alternative font 2\x1b[0m\r\n');
            terminal.write('\t\x1b[14m Alternative font 3\x1b[0m\r\n');
            terminal.write('\t\x1b[15m Alternative font 4\x1b[0m\r\n');
            terminal.write('\t\x1b[16m Alternative font 5\x1b[0m\r\n');
            terminal.write('\t\x1b[17m Alternative font 6\x1b[0m\r\n');
            terminal.write('\t\x1b[18m Alternative font 7\x1b[0m\r\n');
            terminal.write('\t\x1b[19m Alternative font 8\x1b[0m\r\n');
            terminal.write('\x1b[20m Fraktur \x1b[0m\r\n');
            terminal.write('\x1b[21m Doubly underline or Bold off \x1b[0m\r\n');
            terminal.write('\x1b[22m Normal color or intensity \x1b[0m\r\n');
            terminal.write('\x1b[23m Not italic, not Fraktur \x1b[0m\r\n');
            terminal.write('\x1b[24m Underline off \x1b[0m\r\n');
            terminal.write('\x1b[25m Blink off \x1b[0m\r\n');
            terminal.write('\x1b[27m Inverse off \x1b[0m\r\n');
            terminal.write('\x1b[28m Reveal \x1b[0m\r\n');
            terminal.write('\x1b[29m Not crossed out \x1b[0m\r\n');

            terminal.write(' Basic Foreground Colors:\r\n');
            terminal.write('\t\x1b[30m Black foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[31m Red foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[32m Green foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[33m Yellow foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[34m Blue foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[35m Magenta foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[36m Cyan foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[37m White foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[39m Default foreground color \x1b[0m\r\n');

            terminal.write(' Basic Background Colors:\r\n');
            terminal.write('\t\x1b[40m Black background\x1b[0m\r\n');
            terminal.write('\t\x1b[41m Red background\x1b[0m\r\n');
            terminal.write('\t\x1b[42m Green background\x1b[0m\r\n');
            terminal.write('\t\x1b[43m Yellow background\x1b[0m\r\n');
            terminal.write('\t\x1b[44m Blue background\x1b[0m\r\n');
            terminal.write('\t\x1b[45m Magenta background\x1b[0m\r\n');
            terminal.write('\t\x1b[46m Cyan background\x1b[0m\r\n');
            terminal.write('\t\x1b[47m White background\x1b[0m\r\n');
            terminal.write('\t\x1b[49m Default background color \x1b[0m\r\n');

            terminal.write('\x1b[51m Framed \x1b[0m\r\n');
            terminal.write('\x1b[52m Encircled \x1b[0m\r\n');
            terminal.write('\x1b[53m Overlined \x1b[0m\r\n');
            terminal.write('\x1b[54m Not framed or encircled \x1b[0m\r\n');
            terminal.write('\x1b[55m Not overlined \x1b[0m\r\n');
            terminal.write('\x1b[60m ideogram underline or right side line \x1b[0m\r\n');
            terminal.write('\x1b[61m ideogram double underline or double line on the right side \x1b[0m\r\n');
            terminal.write('\x1b[62m ideogram overline or left side line \x1b[0m\r\n');
            terminal.write('\x1b[63m ideogram double overline or double line on the left side \x1b[0m\r\n');
            terminal.write('\x1b[64m ideogram stress marking \x1b[0m\r\n');
            terminal.write('\x1b[65m ideogram attributes off \x1b[0m\r\n');

            terminal.write(' Bright Foreground Colors:\r\n');
            terminal.write('\t\x1b[90m Bright Black foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[91m Bright Red foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[92m Bright Green foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[93m Bright Yellow foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[94m Bright Blue foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[95m Bright Magenta foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[96m Bright Cyan foreground\x1b[0m\r\n');
            terminal.write('\t\x1b[97m Bright White foreground\x1b[0m\r\n');

            terminal.write(' Bright Background Colors:\r\n');
            terminal.write('\t\x1b[100m Bright Black background\x1b[0m\r\n');
            terminal.write('\t\x1b[101m Bright Red background\x1b[0m\r\n');
            terminal.write('\t\x1b[102m Bright Green background\x1b[0m\r\n');
            terminal.write('\t\x1b[103m Bright Yellow background\x1b[0m\r\n');
            terminal.write('\t\x1b[104m Bright Blue background\x1b[0m\r\n');
            terminal.write('\t\x1b[105m Bright Magenta background\x1b[0m\r\n');
            terminal.write('\t\x1b[106m Bright Cyan background\x1b[0m\r\n');
            terminal.write('\t\x1b[107m Bright White background\x1b[0m\r\n');

            // Reset :
            terminal.write('\x1b[0m Reset / Normal \x1b[0m\r\n');
        },

        events: function () {
            // Should fire bell event :
            terminal.write('Ding!\x07\r\n');

            // Should fire title change event :
            terminal.write('\x1b]0;WebSSH is awesome!\x07Change title!\r\n');

            // Should ask to report cursor position :
            terminal.write('\x1b[6n');

            // HTTP URL :
            terminal.write('HTTP URL : https://github.com/isontheline\r\n');

            // IP Address :
            terminal.write('IP Address : 1.2.3.4\r\n');

            // Should write to clipboard :
            terminal.write('\x1b]52;c;' + btoa('WebSSH is awesome!') + '\x1b');

            // Blinking underline cursor :
            terminal.write('\x1b[3 q');

            // Enter alternate buffer :
            //terminal.write('\x1b[?47h');
        },

        progress: function () {
            return XtermTests.progress.demo();
        },

        images: function () {
            return XtermTests.images.demo();
        },

        search: function () {
            return XtermTests.search.demo();
        }
    },

    run: function (name) {
        return Promise.resolve(XtermTests.scenarios[name]());
    },

    runAll: async function () {
        for (const name of Object.keys(XtermTests.scenarios)) {
            await XtermTests.run(name);
        }
    },

    // Historical entry point : synchronous scenarios only (no timed demo).
    launchTests: function () {
        XtermTests.run('sgr');
        XtermTests.run('events');
    },

    // OSC 9;4 progress bar #1706 : unit helpers + scripted demo. Everything
    // goes through terminal.write, hence the real parser -> ProgressHelper ->
    // native (state bar item, sidebar tile, error haptic).
    progress: {
        osc: function (body) {
            terminal.write('\x1b]9;4;' + body + '\x07');
        },

        set: function (value) {
            XtermTests.progress.osc('1;' + value);
        },

        error: function (value) {
            XtermTests.progress.osc(value === undefined ? '2' : '2;' + value);
        },

        indeterminate: function () {
            XtermTests.progress.osc('3');
        },

        pause: function (value) {
            XtermTests.progress.osc(value === undefined ? '4' : '4;' + value);
        },

        remove: function () {
            XtermTests.progress.osc('0');
        },

        // Faulty / edge sequences : nothing must move except the clamp (1;250 -> 100).
        faulty: function () {
            XtermTests.progress.osc('1;x');
            XtermTests.progress.osc('1;2;3');
            terminal.write('\x1b]9;hello\x07');
            XtermTests.progress.osc('1;250');
        },

        // Timeline (~ 15 s) : 0 -> 100 % (50 ms / step), completion check, then
        // error (last value reused), pause, indeterminate, faulty, remove.
        // Each step is announced in the terminal.
        demo: async function () {
            const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            const step = (label, ms) => {
                terminal.write('\r\n\x1b[2mOSC 9;4 : ' + label + '\x1b[0m\r\n');
                return sleep(ms);
            };

            await step('0 -> 100 %', 0);
            for (let i = 0; i <= 100; i++) {
                XtermTests.progress.set(i);
                await sleep(50);
            }

            XtermTests.progress.remove();
            await step('remove -> completion check (1.5 s)', 2500);

            XtermTests.progress.set(40);
            await step('set 40', 1000);

            XtermTests.progress.error();
            await step('error (value reused = 40, one haptic)', 1500);

            XtermTests.progress.error(70);
            await step('error 70 (no second haptic)', 1500);

            XtermTests.progress.pause();
            await step('pause (70 kept)', 1500);

            XtermTests.progress.indeterminate();
            await step('indeterminate (spinner)', 2500);

            XtermTests.progress.faulty();
            await step('faulty : only 1;250 -> 100 % changes', 1500);

            XtermTests.progress.remove();
            await step('remove', 0);
        }
    },

    // Inline images #1457 #1708 : SIXEL + iTerm2 inline images through the
    // real parser -> HandlerHelper (OSC 1337) / @xterm/addon-image. Also
    // guards the OSC 1337 handler chain (badge must survive the addon).
    images: {
        // 1x1 red PNG (68 bytes) :
        PNG_1x1: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',

        // 12x12 red square, VT340 palette register 0 redefined to RGB (100 %, 0, 0) :
        sixel: function () {
            terminal.write('\x1bPq#0;2;100;0;0#0!12~-#0!12~\x1b\\\r\n');
        },

        // Single-shot form (imgcat -l, raw printf) : handled by the addon.
        iipSingle: function () {
            const png = XtermTests.images.PNG_1x1;
            terminal.write('\x1b]1337;File=inline=1;size=' + atob(png).length + ';width=4;height=2;preserveAspectRatio=0:' + png + '\x07\r\n');
        },

        // Multipart form (stock imgcat) : reassembled by InlineImageHelper.
        iipMultipart: function (chunkSize) {
            const png = XtermTests.images.PNG_1x1;
            const size = chunkSize || 20;
            terminal.write('\x1b]1337;MultipartFile=inline=1;size=' + atob(png).length + ';width=4;height=2;preserveAspectRatio=0\x07');
            for (let i = 0; i < png.length; i += size) {
                terminal.write('\x1b]1337;FilePart=' + png.substring(i, i + size) + '\x07');
            }
            terminal.write('\x1b]1337;FileEnd\x07\r\n');
        },

        // Orphan parts must be swallowed without throwing :
        orphanParts: function () {
            terminal.write('\x1b]1337;FilePart=AAAA\x07');
            terminal.write('\x1b]1337;FileEnd\x07');
        },

        // Badge regression : the OSC 1337 handler must keep SetBadgeFormat
        // away from the addon (which swallows anything it cannot parse).
        badge: function (text) {
            terminal.write('\x1b]1337;SetBadgeFormat=' + btoa(encodeURIComponent(text)) + '\x07');
        },

        // DA1 : the addon answers CSI ? 62 ; 4 ; 9 ; 22 c when SIXEL is on.
        da1: function () {
            return new Promise((resolve) => {
                const listener = terminal.onData((data) => {
                    if (data.indexOf('\x1b[?') === 0 && data.endsWith('c')) {
                        listener.dispose();
                        resolve(data);
                    }
                });
                terminal.write('\x1b[c');
                setTimeout(() => { listener.dispose(); resolve(null); }, 1000);
            });
        },

        demo: async function () {
            const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            const step = (label, ms) => {
                terminal.write('\r\n\x1b[2mInline images : ' + label + '\x1b[0m\r\n');
                return sleep(ms);
            };
            const check = (label, ok) => {
                console.log((ok ? 'PASS' : 'FAIL') + ' : ' + label);
                terminal.write('\x1b[' + (ok ? '32m PASS' : '31m FAIL') + '\x1b[0m ' + label + '\r\n');
            };

            const addonLoaded = typeof imageAddon !== 'undefined' && imageAddon !== null;
            const addonExpected = terminalSettings.inlineImagesStrategy !== 'disabled';
            check('addon ' + (addonLoaded ? 'loaded' : 'not loaded') + ' (inlineImagesStrategy = ' + terminalSettings.inlineImagesStrategy + ')', addonLoaded === addonExpected);

            await step('DA1 probe', 0);
            const da1 = await XtermTests.images.da1();
            check('DA1 reply ' + JSON.stringify(da1) + (addonLoaded ? ' contains ;4' : ' is the stock one'), da1 !== null && (da1.indexOf(';4') !== -1) === addonLoaded);

            await step('SIXEL 12x12 red square', 0);
            XtermTests.images.sixel();
            await sleep(300);

            await step('iTerm2 File= (single-shot) 1x1 red PNG on 4x2 cells', 0);
            XtermTests.images.iipSingle();
            await sleep(300);

            await step('iTerm2 MultipartFile / FilePart x N / FileEnd (20-byte chunks)', 0);
            XtermTests.images.iipMultipart(20);
            await sleep(300);
            check('no pending multipart transfer left', InlineImageHelper.pending === null);

            await step('orphan FilePart / FileEnd (must be ignored)', 0);
            XtermTests.images.orphanParts();
            await sleep(100);
            check('orphan parts ignored', InlineImageHelper.pending === null);

            await step('badge regression (SetBadgeFormat)', 0);
            XtermTests.images.badge('IMG OK');
            await sleep(100);
            check('badge content = "IMG OK"', document.getElementById('badge').textContent === 'IMG OK');
            XtermTests.images.badge('');

            if (addonLoaded) {
                await step('storage usage : ' + imageAddon.storageUsage.toFixed(3) + ' MB / ' + imageAddon.storageLimit + ' MB', 0);
                check('images stored', imageAddon.storageUsage > 0);
            }
        }
    },

    // Search in terminal buffer #539 : drives SearchHelper exactly like the
    // native find bar does (Base64 term, options, direction) and captures what
    // would be sent to native through notifySearchResults.
    search: {
        // Deterministic haystack :
        seed: function () {
            const lines = [
                'alpha beta gamma',
                'Alpha ALPHA alphabet',
                'needle haystack needle',
                'foo123 bar456 baz789',
                'regex [bracket] test',
                'end'
            ];
            terminal.write('\r\n' + lines.join('\r\n') + '\r\n');
        },

        // Runs one SearchHelper call and resolves with the next {index, count, status}
        // that SearchHelper.notify would forward to native (coalescing bypassed).
        expect: function (run, timeoutMs) {
            return new Promise((resolve) => {
                const original = SearchHelper.notify;
                const timer = setTimeout(() => {
                    SearchHelper.notify = original;
                    resolve({ index: null, count: null, status: 'timeout' });
                }, timeoutMs || 1000);

                SearchHelper.notify = function (index, count, status) {
                    clearTimeout(timer);
                    SearchHelper.notify = original;
                    SearchHelper.lastNotified = [index, count, status].join(':');
                    resolve({ index: index, count: count, status: status });
                };

                run();
            });
        },

        find: function (term, options, direction) {
            return XtermTests.search.expect(() => {
                SearchHelper.find(Base64.utoa(term), options || {}, direction || 'next');
            });
        },

        demo: async function () {
            const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            const step = (label) => {
                terminal.write('\r\n\x1b[2mSearch : ' + label + '\x1b[0m\r\n');
            };
            const check = (label, ok) => {
                console.log((ok ? 'PASS' : 'FAIL') + ' : ' + label);
                terminal.write('\x1b[' + (ok ? '32m PASS' : '31m FAIL') + '\x1b[0m ' + label + '\r\n');
            };

            check('addon loaded', typeof searchAddon !== 'undefined' && searchAddon !== null);
            check('decorations configured from theme', SearchHelper.decorations !== null && /^#[0-9a-f]{6}/i.test(SearchHelper.decorations.matchBackground));

            step('seed');
            XtermTests.search.seed();
            await sleep(200);

            SearchHelper.begin();
            check('begin() mutes selection notifications', SearchHelper.active === true && TerminalHelper.canNotifySelectionChange === false);

            let r = await XtermTests.search.find('alpha');
            check('"alpha" (default) : 4 matches, index 0 -> ' + JSON.stringify(r), r.count === 4 && r.index === 0 && r.status === 'ok');

            r = await XtermTests.search.expect(() => SearchHelper.next());
            r = await XtermTests.search.expect(() => SearchHelper.next());
            check('next x2 : index 2 -> ' + JSON.stringify(r), r.index === 2);

            r = await XtermTests.search.expect(() => SearchHelper.previous());
            check('previous : index 1 -> ' + JSON.stringify(r), r.index === 1);

            r = await XtermTests.search.find('alpha', { caseSensitive: true });
            check('caseSensitive : 2 matches -> ' + JSON.stringify(r), r.count === 2);

            r = await XtermTests.search.find('alpha', { caseSensitive: true, wholeWord: true });
            check('caseSensitive + wholeWord : 1 match -> ' + JSON.stringify(r), r.count === 1);

            r = await XtermTests.search.find('\\d{3}', { regex: true });
            check('regex \\d{3} : 3 matches -> ' + JSON.stringify(r), r.count === 3);

            r = await XtermTests.search.find('[', { regex: true });
            check('regex "[" : invalid, nothing selected, no decoration -> ' + JSON.stringify(r),
                r.status === 'invalid' && terminal.getSelection() === '' && searchAddon._highlightDecorations.length === 0);

            terminal.write('after invalid regex\r\n');
            await sleep(400);
            check('no refresh crash after invalid regex', SearchHelper.active === true);

            r = await XtermTests.search.find('zzz-not-there');
            check('no result : count 0, status none -> ' + JSON.stringify(r), r.count === 0 && r.status === 'none');

            r = await XtermTests.search.find('needle');
            // Labels written into the terminal must not contain the term itself :
            check('haystack word : 2 matches -> ' + JSON.stringify(r), r.count === 2);

            step('live growth : writing one more line with the haystack word');
            r = await XtermTests.search.expect(() => terminal.write('needle\r\n'), 1500);
            check('addon refresh after write : 3 matches -> ' + JSON.stringify(r), r.count === 3);

            r = await XtermTests.search.expect(() => SearchHelper.clear());
            check('clear() : idle -> ' + JSON.stringify(r), r.count === 0 && r.status === 'idle' && SearchHelper.lastTerm === '');

            SearchHelper.end();
            check('end() restores selection notifications', SearchHelper.active === false && TerminalHelper.canNotifySelectionChange === true);
        }
    }
}
