---
title: Telnet Connections
seo_title: "Telnet Client for iPhone, iPad and Mac: Port, Local Echo, Line Endings, BBS and Raw TCP - WebSSH"
description: "Use WebSSH as a Telnet client on iPhone, iPad and Mac: enable the Telnet role, choose the port, set the local echo, the carriage return and the character set, connect to a BBS or switch to a raw TCP connection for serial-over-IP devices."
---
# Telnet Connections

WebSSH is also a Telnet client. Telnet is still the way in to a lot of equipment: network switches and routers before SSH is enabled, console servers, industrial controllers, lab instruments, retro computers and bulletin board systems (BBS).

!!! warning "Telnet is not encrypted"
    Everything travels in clear text, logins and passwords included. Use Telnet on a network you trust, or reach the device through a VPN or an SSH [Port Forwarding](../networking/local-port-forwarding.md). When the device offers SSH, prefer SSH.

## Create a Telnet connection

1. Add a new server (or edit an existing one) and type its **Host**
2. Open **Roles** and enable **Telnet**
3. In the **Telnet** section, set the **Port** (23 by default)
4. Save, then launch the server

A server can hold several roles at once, SSH and Telnet for instance: the same entry then reaches the same host both ways.

WebSSH does not log in for you: answer the login and password prompts of the device in the terminal.

## Settings that matter for Telnet

The first two are in the **Telnet** section of the server, the others in its **Terminal Settings**.

| Setting | What it does |
| --- | --- |
| **Port** | TCP port of the Telnet service, 23 by default. |
| **Raw connection**[^1] | Turns the Telnet protocol off and opens a plain TCP socket instead, for devices that are not Telnet servers. See [Raw TCP Connection](raw-tcp-connection-serial-over-ip.md). |
| **Local Echo** | Whether WebSSH displays what you type by itself. See below. |
| **Carriage Return** | What Enter sends on a [raw connection](raw-tcp-connection-serial-over-ip.md). On Telnet, Enter always sends the Telnet end of line, see below. |
| **Remote Character Set** | UTF-8 by default. Choose **CP437** for a BBS or a device that uses the IBM PC character set. |

### Local Echo

| Value | Behaviour |
| --- | --- |
| **Auto** | Follows the server. WebSSH echoes what you type until the server announces that it does the echo itself, which most servers do as soon as the connection opens. |
| **Enabled** | WebSSH always displays what you type. For devices that never echo. |
| **Disabled** | WebSSH never displays what you type. For devices that echo without announcing it: this is what to choose when every character appears twice. |

### What Enter sends

On a Telnet connection, Enter always sends one `CR LF` pair, the end of line defined by the Telnet protocol, whatever the **Carriage Return** setting says[^2]. A device that must receive a carriage return alone, or a line feed alone, is not a Telnet server: use a [raw connection](raw-tcp-connection-serial-over-ip.md), where the setting is applied as it is.

## Bulletin board systems (BBS)

Most BBS software expects the CP437 character set and an 80 x 24 screen. See [Use Mystic BBS with Telnet CP437 codepage](use-mystic-bbs-telnet-cp437-character-translation.md) for the two lines to add to your SSH config file.

## Serial ports published on the network

A serial-to-IP bridge (ser2net, ESP-Link, USR-TCP232, Moxa NPort…) exposes a serial port on a TCP port. Two cases:

* the bridge runs in **Telnet mode** (ser2net `telnet`, RFC 2217): it is a Telnet server, connect as described above
* the bridge runs in **raw mode** (a plain TCP socket): turn [Raw connection](raw-tcp-connection-serial-over-ip.md) on, otherwise characters get lost or added

To paste a file to such a device without overflowing its buffer, see [Paste Slowly](paste-slowly-serial-devices.md).

## Good to know

- The **Terminal type** setting does not apply to Telnet: a server that asks for the terminal type is answered `dumb`.
- The size of the window is not sent to the server. Programs that need a given size, like most BBS, expect 80 x 24: fix it with `#!FixedSize 80x24` in your [SSH config file](../SSH/ssh-config-file.md).
- The [Terminal State Bar](/documentation/terminal-state-bar/) is not available on Telnet sessions.
- Text is sent as UTF-8.
- On a Mac, a serial port plugged into the computer can be opened directly, without any network bridge.

[^1]: The raw connection requires WebSSH 33.4 or later.
[^2]: Before WebSSH 33.4, choosing `\r\n` sent the end of line twice, and characters outside ASCII (accents, symbols) were sent truncated. Both are fixed in 33.4.
