---
title: Raw TCP Connection
seo_title: "Raw TCP Connection: Reach Serial-over-IP Bridges Without the Telnet Protocol - WebSSH"
description: "Open a raw TCP connection from WebSSH on iPhone, iPad and Mac, like netcat or PuTTY Raw: no Telnet negotiation, no line ending translation. For serial-to-IP bridges, retro computers and other devices that are not Telnet servers."
---
# Raw TCP Connection

??? abstract "What is it?"
    Since WebSSH 33.4[^1], a Telnet connection can be switched to a **raw connection**: a plain TCP socket with no Telnet protocol on top. What you type is sent byte for byte, what the device sends is displayed byte for byte. This is the equivalent of `nc host port`, of PuTTY's *Raw* connection type or of `socat - TCP:host:port`, and it is free.

## When do you need it?

Many devices listen on a TCP port without being Telnet servers:

* a **serial port published on the network** by a serial-to-IP bridge (ser2net in raw mode, ESP-Link, USR-TCP232, a Moxa NPort in TCP server mode…)
* **retro computers** and single-board machines (RC2014, Z80 or 6502 boards, CP/M monitors…) reached through such a bridge
* **microcontroller consoles**, lab instruments, GPS receivers and anything you would normally test with `nc`

A Telnet client talks to them in a language they do not speak. The usual symptoms are:

* **missing characters**, or a device that seems to swallow part of what it sends
* a **line feed added** after every Enter, which a ROM monitor may read as one more command
* **stray characters received by the device** right after it sent some binary data
* everything you type **shown twice**

!!! tip "Does it work with netcat?"
    If `nc host port` or PuTTY *Raw* works with your device and Telnet does not, a raw connection is what you need.

## Telnet or raw?

| | Telnet | Raw connection |
| --- | --- | --- |
| **Options negotiation** | Answers the server's requests (echo, terminal type…) | Nothing is negotiated, nothing is sent until you type |
| **Byte `0xFF` received** | Start of a Telnet command, the bytes that follow are interpreted | A byte like any other, displayed as it is |
| **Enter** | Always one `CR LF`, the Telnet end of line | Exactly the **Carriage Return** of the Terminal Settings (`\r` by default) |
| **Local Echo set to Auto** | On until the server says it echoes | Off, the device echoes or not |

A bridge configured in **Telnet mode** (ser2net `telnet`, RFC 2217 serial port control) is a real Telnet server: leave the raw connection off for it, see [Telnet Connections](telnet-connections.md).

## Turn it on

1. Edit your server settings (or add a new server)
2. Open **Roles** and enable **Telnet**
3. In the **Telnet** section, type the **Port** of your device
4. Turn **Raw connection** on
5. Save, then launch the server as usual

The setting belongs to the server and follows it through [iCloud](/documentation/help/iCloud/). Turn it off to go back to Telnet, nothing else changes.

## What is sent and what is displayed

* **Enter** sends the **Carriage Return** chosen in the connection's **Terminal Settings**: `\r` (the default, what most serial monitors expect), `\n` or `\r\n`. Nothing is added.
* **Control keys** are plain bytes: `Ctrl + C` sends `0x03`, `Esc` sends `0x1B`. They reach the device, they do not close the connection.
* **Text** is sent as UTF-8. Plain ASCII, which is all most serial devices understand, is one byte per character.
* **What the device sends** is displayed without any filtering: UTF-8 when it is valid UTF-8, one character per byte otherwise. Set the **Remote Character Set** to CP437 for a device that draws boxes with the IBM PC character set.
* **Local Echo** (Terminal Settings): leave it on **Auto** or **Disabled** when the device echoes what it receives, choose **Enabled** when you do not see what you type.

| You are used to | In WebSSH |
| --- | --- |
| `nc 10.0.20.20 4196` | Raw connection on |
| PuTTY *Raw*, with *Local echo* and *Local line editing* forced off | Raw connection on, Local Echo on Auto or Disabled |
| `socat -,rawer,echo=0 TCP:10.0.20.20:4196` | Raw connection on, Local Echo on Auto or Disabled |

## Pasting a file or a listing

A raw connection removes the bytes Telnet was adding, it does not slow anything down. A device without flow control still loses characters when a whole file arrives at once: see [Paste Slowly](paste-slowly-serial-devices.md) to send an Intel HEX file or a BASIC listing in small chunks.

## Troubleshooting

??? question "How can I see exactly what WebSSH sends?"
    On a Mac, listen on a port with netcat and print every byte:

    ```bash
    nc -l 4196 | xxd -c 1
    ```

    Then connect WebSSH to `127.0.0.1`, port `4196`, with the raw connection on. Typing `a` then Enter prints `61` then `0d`, and nothing else. With the raw connection off, Enter prints `0d` then `0a`.

??? question "Everything I type appears twice"
    WebSSH and the device both echo. Set **Local Echo** to **Disabled** in the connection's Terminal Settings.

??? question "I do not see what I type"
    The device does not echo. Set **Local Echo** to **Enabled**.

??? question "The device ignores Enter, or runs every command twice"
    It expects another end of line. Change **Carriage Return** in the Terminal Settings: `\r` for most monitors and modems, `\n` for Unix-like consoles, `\r\n` for a few line-oriented services.

??? question "Characters are still lost when I paste"
    The device cannot keep up with a burst. Use [Paste Slowly](paste-slowly-serial-devices.md), or make it the default **Paste Mode** of the connection.

!!! warning "No encryption"
    Like Telnet, a raw connection is not encrypted and not authenticated. Keep it on a network you trust, or reach the device through a VPN or an SSH [Port Forwarding](../networking/local-port-forwarding.md).

[^1]: The raw connection requires WebSSH 33.4 or later.
