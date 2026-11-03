---
title: Copying text to the clipboard from the terminal
seo_title: "Copy Text from an SSH Terminal to the Clipboard (OSC 52) - WebSSH"
description: "Copy command output from a remote SSH session to your local clipboard with the OSC 52 escape sequence, as simple as: cat filename.txt | wshcopy"
---

!!! tip "Copy to clipboard support"
    WebSSH[^1] supports[^2] OSC52 terminal escape sequence that allows copying text to the clipboard from within the terminal. It is supported by many other[^3] terminal emulators, including xterm, gnome-terminal, and iTerm2.

# How to copy output to the clipboard?
## It's simple as : 
* `cat filename.txt | wshcopy`
* `echo "WebSSH is awesome!" | wshcopy`

`wshcopy` will handle the output and send it to WebSSH by using "invisible" terminal chars.

!!! info "Clipboard Access Strategy"
    Since WebSSH 33.3[^4], a remote write to the clipboard is **accepted by default** and signalled by a short **"Clipboard updated"** notice on the connection item of the [terminal state bar](/documentation/terminal-state-bar/). Nothing interrupts you, like in kitty, Alacritty, WezTerm or Ghostty.

    If you prefer to approve every write, or to refuse them all, change **Settings > Advanced Settings > Security > Clipboard Access Strategy** to **Ask** (an alert for every sequence, the behaviour of versions before 33.3) or **Deny**. Reading the clipboard from the remote side (`?` query) is not supported.

## How to install wshcopy
`pip3 install webssh-sh`

## How to use with tmux >= 3.3
* `set -g allow-passthrough on` **THEN** `echo "WebSSH is awesome!" | wshcopy -t tmux`
* **OR**
* `set -g set-clipboard on` **THEN** `echo "WebSSH is awesome!" | wshcopy -t default`

Since WebSSH 33.3, `set -g set-clipboard on` alone is enough for tmux's own copies (copy mode, mouse selection, `tmux capture-pane -pS - | tmux load-buffer -w -`) to reach the device clipboard: earlier versions ignored the empty selector tmux uses.

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
| *(empty)* | the selector tmux sends for its own buffers (`set-clipboard`, `set-buffer -w`, `load-buffer -w`) | :white_check_mark: since 33.3 |
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
[^4]: Before 33.3 the default strategy was Ask.