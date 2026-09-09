---
title: Terminal Progress Bar (OSC 9;4)
---
# Terminal Progress Bar (OSC 9;4)
Since WebSSH 32.10[^1], the terminal understands the `OSC 9;4` escape sequence, originally created by [ConEmu](https://conemu.github.io/en/AnsiEscapeCodes.html#ConEmu_specific_OSC) and adopted by Ghostty, Windows Terminal, WezTerm and Konsole. A long running command can report its progress and WebSSH displays it **outside** of the terminal output.

!!! info "Where is the progress displayed?"
    * **[State Bar](/documentation/terminal-state-bar/)**: a dedicated item appears while a job reports progress (ring + percentage, red triangle on error, orange pause icon, spinner when indeterminate, green check for a moment when the job completes). The State Bar must be visible for the connection.
    * **Sidebar**: a thin bar at the bottom of the session tile, so you can follow a job running in another session.
    * **iPhone**: a haptic feedback when a job enters the error state (follows the "Bell Vibration / Beep" setting).

## Sequence
`OSC 9 ; 4 ; state ; value ST`

* `OSC` is `ESC ]` (`\e]`)
* `ST` is `BEL` (`\a`) or `ESC \`
* **state** is a single digit:

| State | Name | Description | Displayed as |
| --- | --- | --- | --- |
| `0` | Remove | Hides the progress indicator. The value is ignored. | Green check "100 %" for 1.5 s, then hidden |
| `1` | Set | Normal progress with the given value (0-100) | Ring + percentage |
| `2` | Error | Error state. An omitted or zero value keeps the last value. | Red triangle + percentage |
| `3` | Indeterminate | Work is happening but no percentage is available. The value is ignored. | Spinner |
| `4` | Pause | Paused / warning state. An omitted or zero value keeps the last value. | Orange pause icon + percentage |

* **value** is optional, from `0` to `100`. Greater values are clamped to `100`. Only decimal digits are accepted: a malformed value discards the whole sequence.

## Examples
All the examples below can be pasted as is in a WebSSH terminal.

### Set a value
```bash
printf '\e]9;4;1;50\a'
```

### Animate from 0 to 100 %
```bash
for i in $(seq 0 100); do printf '\e]9;4;1;%d\a' $i; sleep 0.05; done
```

### Complete a job
```bash
printf '\e]9;4;0\a'
```
The indicator shows a green check with "100 %" for a moment, then disappears.

### Error state
```bash
printf '\e]9;4;1;40\a'; sleep 1; printf '\e]9;4;2\a'
```
The value (40 %) is kept and the indicator turns red. On iPhone, a haptic feedback is played once when the job enters the error state.

```bash
printf '\e]9;4;2;70\a'
```
Same error state with a new value, no second haptic feedback.

### A job that fails halfway
```bash
for i in $(seq 0 5 60); do printf '\e]9;4;1;%d\a' $i; sleep 0.1; done; printf '\e]9;4;2\a'
```

### Pause / warning state
```bash
printf '\e]9;4;1;55\a'; sleep 1; printf '\e]9;4;4\a'
```

```bash
printf '\e]9;4;4;80\a'; sleep 1.5; printf '\e]9;4;1;80\a'
```
Pause with a new value, then resume at the same value.

### Indeterminate state
```bash
printf '\e]9;4;3\a'
```

### Clamping and malformed sequences
```bash
printf '\e]9;4;1;250\a'    # clamped to 100 %
printf '\e]9;4;1;x\a'      # ignored : value is not a decimal number
printf '\e]9;4;1;2;3\a'    # ignored : too many parameters
```

## Wrap any long running command
A small shell function is enough to get an indeterminate indicator while a command runs, then a green check or a red triangle depending on its exit code:

```bash
osc_progress() { printf '\e]9;4;%s\a' "$1"; }

run_with_progress() {
    osc_progress 3
    if "$@"; then
        osc_progress 0
    else
        local status=$?
        osc_progress 2
        return $status
    fi
}

run_with_progress apt-get upgrade -y
```

When the command knows its own progress, report it with state `1`:

```bash
total=$(ls *.log | wc -l); n=0
for f in *.log; do
    gzip "$f"
    n=$((n + 1))
    printf '\e]9;4;1;%d\a' $((n * 100 / total))
done
printf '\e]9;4;0\a'
```

## Using tmux
tmux does not forward unknown `OSC` sequences to the terminal. Enable passthrough and wrap the sequence in a `DCS tmux` envelope (every `ESC` of the inner sequence is doubled):

```bash
# in .tmux.conf (tmux >= 3.3)
set -g allow-passthrough on
```

```bash
printf '\ePtmux;\e\e]9;4;1;50\a\e\\'
```

## Stuck indicator?
A job killed before sending the `0` state (for instance with `Ctrl+C`) never removes its indicator. WebSSH handles it two ways:

* **`Ctrl+C`** typed in the terminal clears the indicator. A program that catches `Ctrl+C` and keeps running will simply report its progress again.
* **"Clear"** in the contextual menu of the State Bar item (long press on iOS, right click on macOS).

## Settings
* **Progress Bar (OSC 9;4)**: enable or disable the feature (iOS: within system settings > WebSSH > SSH / macOS: within the app settings > SSH). Enabled by default.
* **Bell Vibration / Beep**: the error haptic feedback follows this setting.
* The State Bar item is only visible when the [State Bar](/documentation/terminal-state-bar/) is shown for the connection. Nothing is drawn inside the terminal itself.

## Useful links
* [ConEmu ANSI escape codes](https://conemu.github.io/en/AnsiEscapeCodes.html#ConEmu_specific_OSC)
* [OSC 9;4 - Progress Bar Sequence](https://rockorager.dev/misc/osc-9-4-progress-bars/)
* [How to test that my terminal can report progress with OSC 9;4 sequences](https://unix.stackexchange.com/questions/801884/how-to-test-that-my-terminal-can-report-progress-with-osc-94-sequences)
* [xterm.js addon-progress](https://github.com/xtermjs/xterm.js/tree/master/addons/addon-progress)
* [GitHub issue #1706](https://github.com/isontheline/pro.webssh.net/issues/1706)

[^1]: Requires at least iOS 26 or macOS 26
