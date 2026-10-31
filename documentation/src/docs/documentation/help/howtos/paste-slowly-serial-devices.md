---
title: Paste Slowly
seo_title: "Paste Slowly: Send Pasted Text in Small Chunks to Serial and Retro Devices - WebSSH"
description: "Paste text in rate-limited chunks from WebSSH on iPhone, iPad and Mac: bytes per chunk, delay between chunks, extra delay after each line, per-server defaults. For serial devices without flow control, retro computers and tiny input buffers."
---
# Paste Slowly

??? abstract "What is it?"
    Since WebSSH 33.3[^1], the clipboard can be pasted **slowly**: the text is sent in small chunks with a pause between them instead of one burst. This is the equivalent of iTerm2's *Paste Slowly* / *Advanced Paste*, and it is free.

## When do you need it?

Some devices cannot keep up with a normal paste:

* a **serial port reached through a serial-over-TCP bridge** (ser2net, ESP-Link, a USB-serial adapter on a Raspberry Pi…) with **no flow control** (no CTS/RTS, no XON/XOFF) and a small UART buffer (16 bytes on a classic 16550)
* **retro computers** and single-board machines (RC2014, Z80 or 6502 boards, CP/M monitors, an Apple II…) where you paste an Intel HEX or a BASIC listing into a monitor that processes one line at a time
* **microcontroller REPLs** (MicroPython, CircuitPython, a Forth…) and network gear consoles that drop characters when they arrive too fast

When the buffer overflows, characters are silently lost and the pasted program or file is corrupted. Pasting slowly keeps every chunk under the size of the buffer and gives the device time to drain it.

## Paste slowly once

| Platform | How |
| --- | --- |
| **iPhone / iPad** | Long press the terminal **or** tap the "…" ellipsis button, then **Paste Special** > **Paste Slowly** |
| **Mac** | Right click the terminal, then **Paste Special** > **Paste Slowly** **OR** press `⌥⌘V` (menu **Edit** > **Paste Slowly**) |
| **Keyboard accessory bar** | Add the `{PASTE_SLOW}` key to your layout, see [Keyboard Accessory View Customisation](SSH/customise-keyboard-accessory-view-layout.md) |

The paste starts with the current values: **16 bytes per chunk, 125 ms between chunks** by default (the same values as iTerm2), or the values you saved for this server (see below).

While the paste runs, a small card at the top of the terminal shows the progress and the time left. You can **cancel** it with the card's ✕ button or by pressing `Ctrl + C` in the terminal.

## Advanced Paste : choose the speed

**Paste Special** > **Advanced Paste…** (`⌃⌥⌘V` on the Mac) opens a sheet before pasting:

| Setting | Meaning | Default |
| --- | --- | --- |
| **Bytes per chunk** | Maximum number of bytes sent at once. Keep it at or below the size of the target's input buffer. A multi-byte character or a `CR LF` pair is never split across two chunks. | 16 |
| **Delay between chunks (ms)** | Pause after every chunk. | 125 |
| **Extra delay after each line (ms)** | Added to the previous delay after every line ending, for monitors and loaders that parse and acknowledge one line at a time (Intel HEX, BASIC listings). | 0 |

The sheet also shows the size of the clipboard, its number of lines and the **estimated duration** of the paste, recomputed as you change the values.

??? tip "Remember for this server"
    The values you paste with always become the new defaults. Turn **Remember for this server** on to also keep a dedicated copy for the current connection: that server will use its own values whenever a slow paste runs, whatever the global defaults become later. Turn the switch off and paste once to forget them. These values follow the connection through iCloud sync.

??? tip "Rough guide to the values"
    | Target | Bytes per chunk | Delay | Line delay |
    | --- | --- | --- | --- |
    | 16550 UART, no flow control, 9600 bauds | 16 | 125 ms | 0 |
    | Same, with a monitor parsing each line (HEX loader) | 16 | 125 ms | 100 – 300 ms |
    | MicroPython / CircuitPython REPL in paste mode (`Ctrl + E`) | 64 | 50 ms | 50 ms |
    | Slow network console (switch, PDU, BMC) | 32 | 50 ms | 0 |

    At 9600 bauds a byte takes about 1 ms on the wire: 16 bytes every 125 ms leaves the device more than 100 ms to drain its buffer.

## Always paste slowly on a server

For a device that must **never** receive a burst paste, make slow paste the default behaviour of its connection:

1. Edit the connection and open **Terminal Settings**
2. Set **Paste Mode** to **Slowly (chunked)**

From then on every paste on that connection — `⌘V`, the Paste menu item, the `{PASTE}` key, `⌘` + click — runs slowly with the server's values (or the global defaults). The **Paste Slowly** and **Advanced Paste…** entries stay available on every other connection.

??? info "Global defaults"
    The default values are also listed in **Settings** > **Advanced Settings** > **SSH** > **Slow Paste**. They are the values used by **Paste Slowly** on a server that has no values of its own.

## Tips

* **Carriage return**: in the connection's **Terminal Settings**, set **Carriage Return** to `\r` for serial targets. With `\r\n` every line ending costs two bytes, and the Telnet role turns each of them into a `CR LF` pair, so a 16-byte budget is reached sooner than it looks.
* **Bracketed paste** is honoured: when the remote program asked for it, the whole slow paste is wrapped in a single bracketed-paste sequence, even if you cancel it.
* **Broadcast Input**: with [split panes](split-panes-and-broadcast-input.md) and Broadcast Input on, the other panes receive the chunks at the same slow pace.
* **One paste at a time**: a second paste requested while a slow paste runs is ignored. Cancel the first one if you need to start over.
* **Background**: on iPhone and iPad, a long slow paste pauses while WebSSH is in the background and resumes when you come back.

[^1]: Paste Slowly, Advanced Paste, the `{PASTE_SLOW}` key and the Paste Mode profile setting require WebSSH 33.3 or later.
