---
title: Compose Bar
seo_title: "Compose Bar: Write Prompts and Long Commands in a Real Text Field - WebSSH"
description: "The WebSSH compose bar replaces the keys above the keyboard with a multi-line text field: autocorrection, cursor and selection, on-device dictation, photo and file attachments. Write a prompt for Claude Code, Codex or any coding agent, then send it to the terminal."
---
# Compose Bar

??? abstract "What is it?"
    Since WebSSH 33.4[^1], the row of keys above the keyboard can turn into a **text field**. You write there as in any app (autocorrection, cursor, selection, dictation), over several lines, and WebSSH sends the whole text to the terminal when you are ready.

    It was made for the prompts of coding agents (Claude Code, Codex, OpenCode…), and it serves just as well for a long command or a commit message. It is free and works in every kind of session: SSH, Telnet, mosh, serial, local shell.

## Opening the bar

* **On the keys above the keyboard**: the **Compose** key, on the third page of the default layout. If you customised your layout, add the `{COMPOSE}` key from the [layout editor](SSH/customise-keyboard-accessory-view-layout.md).
* **Terminal menu (⋯)** > **Compose**
* **Hardware keyboard**: `Option + Cmd + Enter` (on the Mac: **Edit** > **Compose**). The same shortcut goes back to the terminal.
* **State Bar**: add the **Compose** item from the *Built-in Items* picker of the [Terminal State Bar](/documentation/terminal-state-bar/).

The field takes the place of the keys, so it costs no room on screen while your text fits on one line. It then grows up to five lines and scrolls beyond.

## Writing and sending

| Action | What it does |
| --- | --- |
| **Send** button (arrow) | Pastes your text in the terminal, then validates it (as if you pressed `Enter`) |
| **Long press** on the Send button | The arrow turns into an insert symbol: release to put the text in the terminal **without validating it**, slide away to cancel |
| `Enter` on a hardware keyboard | Sends |
| `Shift + Enter` on a hardware keyboard | New line in your text |
| Return key of the on-screen keyboard | New line in your text |
| **Keyboard** button, on the left | Gives the keys back (on the Mac, a cross closes the bar) |

!!! tip "Good to know"
    * Your text is kept when you give the keys back: you find it again when you reopen the bar, until the session is closed. Nothing is saved on the device.
    * The text is sent as a paste. Programs that ask for *bracketed paste* (Claude Code, modern shells, editors) receive a multi-line text as a single block. In a plain shell without it, each line break validates the line, exactly like a paste.
    * Your clipboard is never touched.
    * While you write in the field, `Esc`, the arrows and the other keys are not on screen: tap the keyboard button to get them back, for example to answer a question of the agent.

## Dictation

The **microphone** in the field turns what you say into text:

* **Tap** to start, tap again to stop.
* **Long press** to dictate while your finger stays down.

Recognition runs **on your device**: nothing is sent to a server, and it works without a network. The first use asks for the *Speech Recognition* and *Microphone* permissions.

The language is the one of your device. To dictate in another one, open the **paperclip** menu (a microphone on connections that are not SSH) > **Dictation Language**. Only the languages your device can recognise on its own are listed, so the list depends on the device and on the system version.

Dictated sentences are added one after the other, and the text stays editable before you send it. Typing by hand, sending, closing the bar or leaving the session stops the microphone.

## Attachments

On SSH connections, the **paperclip** menu also sends files to the server and adds their paths to your text:

* **Photos**: one or several pictures of your library
* **Take Photo**: on devices with a camera
* **Files**: any file

The files are uploaded over your SSH connection (SCP) to the upload folder of the session, `/tmp/webssh-uploads` by default. Once uploaded, their remote paths are added at the end of your text, so that the agent can open them: this is how you show a screenshot to Claude Code running on a remote server.

Photos are resized to 2000 pixels on their longest side and sent as JPEG.

!!! info "Free allowance"
    Uploading files from the terminal is a **WebSSH PRO** feature. Without PRO you can upload **three files each time you launch WebSSH**, whatever the way: attachments of the compose bar, drag and drop on the terminal, pasted image or **Upload File** in the terminal menu.

[^1]: The compose bar, the `{COMPOSE}` key and the Compose item of the State Bar require WebSSH 33.4 or later.
