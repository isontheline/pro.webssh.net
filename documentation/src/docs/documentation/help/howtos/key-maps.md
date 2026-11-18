---
title: Key Maps
seo_title: "Key Maps: Remap Arrow, Navigation and Function Keys per Server - WebSSH"
description: "Change what the arrow keys, Home, End, Page Up, Page Down, Insert, Delete, Backspace, Esc, Tab, Enter and F1 to F12 send in WebSSH on iPhone, iPad and Mac, per server. WordStar / CP/M and Emacs presets, custom control characters and byte sequences, for vintage systems and programs that do not understand ANSI cursor keys."
---
# Key Maps

??? abstract "What is it?"
    Since WebSSH 33.5[^1], a **key map** changes what the special keys send: the arrows, `Home`, `End`, `Page Up`, `Page Down`, `Insert`, `Delete`, `Backspace`, `Esc`, `Tab`, `Enter` and `F1` to `F12`. A key map is chosen **per server** and applies to the hardware keyboard and to the keyboard accessory bar alike.

## When do you need it?

A modern terminal sends ANSI escape sequences for its cursor keys: the up arrow sends `ESC [ A`. Some programs do not understand them:

* **vintage systems**: terminals of the 1970s had no cursor keys, so CP/M editors, WordStar, Turbo Pascal and many monitors move the cursor with control characters (the "WordStar diamond": `Ctrl + E`, `Ctrl + X`, `Ctrl + S`, `Ctrl + D`)
* **line editors and dumb consoles** that only know the Emacs keys (`Ctrl + P`, `Ctrl + N`, `Ctrl + B`, `Ctrl + F`)
* **appliances** whose menus expect a specific byte for a function key

With a key map the arrow keys send what the program expects. The original control combinations keep working: the key map only adds a more comfortable way to send them.

## Choose the key map of a server

1. Edit the connection and open **Terminal Settings**
2. Tap **Key Map** and choose one

The key map is applied every time a terminal opens on that server, on every connection type (SSH, Mosh, Telnet, [raw connection](raw-tcp-connection-serial-over-ip.md)). The other servers are untouched.

## Presets

| Key | WordStar / CP/M | Emacs |
| --- | --- | --- |
| ↑ | `Ctrl + E` | `Ctrl + P` |
| ↓ | `Ctrl + X` | `Ctrl + N` |
| ← | `Ctrl + S` | `Ctrl + B` |
| → | `Ctrl + D` | `Ctrl + F` |
| Home | `Ctrl + Q` `S` | `Ctrl + A` |
| End | `Ctrl + Q` `D` | `Ctrl + E` |
| Page Up | `Ctrl + R` | `Esc` `v` |
| Page Down | `Ctrl + C` | `Ctrl + V` |
| Insert | `Ctrl + V` | |
| Delete | `Ctrl + G` | `Ctrl + D` |

A preset cannot be modified. To start from one, **duplicate** it (long press or right click > **Duplicate**) and edit the copy.

## Create your own key map

Open **Settings** > **Terminal** > **Key Maps** and tap the add button. The editor draws the keys a key map can change. Tap a key — or press it on your hardware keyboard — and choose what it sends:

| Choice | The key sends |
| --- | --- |
| **Default** | Its usual sequence: the key is not remapped |
| **Control Character** | One control character, from `^@` (0x00) to `^_` (0x1F), or `^?` (0x7F) |
| **Another Key** | The usual sequence of another key, for example `Home` sending what the up arrow sends |
| **Custom Sequence** | Any sequence of up to 64 characters, see below |

A remapped key shows what it sends under its legend. Keys without anything under their legend keep their usual sequence.

### Custom sequences

| You type | Sent |
| --- | --- |
| `<ctrl-x>` | The control character of `x`: `<ctrl-e>` is 0x05 |
| `<esc>` | Escape, 0x1B |
| `<tab>` | Tab, 0x09 |
| `\xNN` | The character whose hexadecimal code is `NN`, from `00` to `7F` |
| `\\` | A backslash |
| Anything else | Itself |

For example `<esc>OP` is what `F1` usually sends, and `<ctrl-q>S` is the WordStar "beginning of line". The bytes that will be sent are shown in hexadecimal under the field as you type.

??? info "7-bit characters only"
    A custom sequence accepts characters from 0x00 to 0x7F. What a character above 0x7F becomes on the wire depends on the remote character set of the server, so it cannot be a fixed byte.

## Switch during a session

The same server may run programs that expect different keys. The key map can be changed for the open session without touching the server's setting:

| Platform | How |
| --- | --- |
| **iPhone / iPad** | Tap the "…" ellipsis button, then **Key Map** and choose a key map or **None** |
| **Mac** | Right click the terminal **or** click the "…" ellipsis button, then **Key Map** |
| **Keyboard accessory bar** | Add the `{KEYMAP}` key to your layout, see [Keyboard Accessory View Customisation](SSH/customise-keyboard-accessory-view-layout.md). It turns the key map of the session on and off and stays lit while keys are remapped |

While a key map is active, the "…" ellipsis button of the terminal shows a **badge**. Open it and look at **Key Map** to see which one.

## Good to know

* **Modifiers are left alone**: `Shift`, `Alt` or `Ctrl` held with an arrow key send what they sent before. On a hardware keyboard `Ctrl` + arrow stands for `Page Up`, `Page Down`, `Home` and `End`, and follows the key map of those keys.
* **Only typed keys are remapped**: pasted text, [snippets](snippets.md), the [Compose Bar](compose-bar.md) and the password paste are sent as they are. [Paste Slowly](paste-slowly-serial-devices.md) does not slow a remapped key down.
* **Another Key** follows the [arrow keys mode](SSH/use-arrow-keys-modes.md) of the connection.
* **Broadcast Input**: with [split panes](split-panes-and-broadcast-input.md) and Broadcast Input on, the other panes receive what the remapped key sent.
* **iCloud**: your key maps and the choice made for each server follow iCloud sync. If a key map is deleted, the servers that used it go back to no key map.

[^1]: Key Maps require WebSSH 33.5 or later and WebSSH PRO.
