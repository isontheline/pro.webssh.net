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
    }
}
