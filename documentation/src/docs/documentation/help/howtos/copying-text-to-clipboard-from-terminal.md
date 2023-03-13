---
title: Copying text to the clipboard from the terminal.
---

!!! tip "Copy to clipboard support"
    WebSSH[^1] supports[^2] OSC52 terminal escape sequence that allows copying text to the clipboard from within the terminal. It is supported by many other[^3] terminal emulators, including xterm, gnome-terminal, and iTerm2.

# How to copy output to the clipboard?
## It's simple as : 
* `cat filename.txt | wshcopy`
* `echo "WebSSH is awesome!" | wshcopy`

`wshcopy` will handle the output and send it to WebSSH by using "invisible" terminal chars.

!!! warning "Daemon hides under terminal"
    As the terminal can do "untrusted" things, WebSSH will ask you (by default) if you approve or deny the clipboard access.

    You can change this behavior inside WebSSH settings (iOS : within system settings > WebSSH > SSH / macOS : within the app settings > SSH) : "Clipboard Access Strategy"

## How to install wshcopy
`pip3 install webssh-sh`

## How to use with tmux >= 3.3
* `set -g allow-passthrough on` **THEN** `echo "WebSSH is awesome!" | wshcopy -t tmux`
* **OR**
* `set -g set-clipboard on` **THEN** `echo "WebSSH is awesome!" | wshcopy -t default`

## I would like to improve wshcopy :stuck_out_tongue:
Repository is here : [webssh-sh](https://github.com/isontheline/webssh.sh)

# Documentation about OSC52 Terminal Escape Sequence
## OSC 52 Sequence
The sequence consists of the following:
`OSC 52 ; Pc ; Pd BEL`

* **Pc** is the clipboard choice:

| Choice | Description | Supported by WebSSH |
| --- | --- | --- |
| `c` | clipboard | :white_check_mark: |
| `p` | primary | :x: |
| `q` | secondary | :x: |
| `s` | select | :x: |
| `0-7` | cut-buffers | :x: |

* **Pd** is the data to copy to the clipboard. This string should be encoded in base64 [RFC-4648](https://www.rfc-editor.org/rfc/rfc4648.html).
* If **Pd** is "?", the terminal replies to the host with the current contents of the clipboard.
* If **Pd** is neither a base64 string nor "?", the terminal clears the clipboard.

## Useful links
* [invisible-island](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html#h3-Operating-System-Commands)
* [vim-oscyank](https://github.com/ojroques/vim-oscyank/blob/main/README.md)
* [chromium](https://chromium.googlesource.com/apps/libapps/+/a5fb83c190aa9d74f4a9bca233dac6be2664e9e9/hterm/doc/ControlSequences.md#osc)
* [xterm.js](https://github.com/xtermjs/xterm.js/issues/3260)
* [golangexample](https://golangexample.com/copy-text-to-the-system-clipboard-from-anywhere-using-the-ansi-osc52-sequence/)
* [shcopy](https://github.com/aymanbagabas/shcopy/blob/master/main.go)
* [go-osc52](https://github.com/aymanbagabas/go-osc52/blob/master/osc52.go)
* [tmux](https://github.com/tmux/tmux/wiki/Clipboard)
* [freecodecamp](https://www.freecodecamp.org/news/tmux-in-practice-integration-with-system-clipboard-bcd72c62ff7b/)

[^1]: Since 20.5
[^2]: Only copy to clipboard
[^3]: https://github.com/ojroques/vim-oscyank/blob/main/README.md