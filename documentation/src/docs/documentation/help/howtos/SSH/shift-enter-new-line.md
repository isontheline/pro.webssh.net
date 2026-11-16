---
title: Shift + Enter for a New Line
description: "In the WebSSH terminal, Shift + Enter sends a line feed (the same as Ctrl + J): a new line in the prompt of Claude Code, Codex and other coding agents, without any terminal setup. How it works and how to turn it off."
---

# Shift + Enter for a New Line
Since WebSSH 33.4, on a hardware keyboard, **Shift + Enter** no longer sends the same thing as **Enter**:

| Key | What WebSSH sends | What it does |
| --- | --- | --- |
| `Enter` | Carriage return (or the *Carriage Return* chosen for the connection) | Validates the line, as before |
| `Shift + Enter` | Line feed, the same byte as `Ctrl + J` | A **new line** in programs that tell the two apart |

!!! tip "Writing a multi-line prompt in Claude Code"
    Coding agents such as Claude Code, Codex or OpenCode submit your message on `Enter` and read a line feed as "new line". With WebSSH you can now press `Shift + Enter` to break the line and `Enter` to send, on an iPad with an external keyboard and on the Mac, with nothing to configure on the server (no `/terminal-setup`).

## Good to know
* **In a shell** (bash, zsh, fish…) a line feed validates the command like `Enter` does: you will see no difference there.
* **Inside tmux**, the line feed goes through like any other key: no extra tmux configuration is needed for this.
* **On-screen keyboard**: the Return key of the iOS keyboard always sends `Enter`. To insert a new line without a hardware keyboard, add the **New Line** key (`{NEW_LINE}`) to your [keyboard accessory bar](customise-keyboard-accessory-view-layout.md): it is not part of the default layout. It sends the line feed whatever the Shift + Enter setting below says.
* **Other modifiers** are left alone: `Option + Enter`, `Ctrl + Enter` and `Cmd + Enter` behave as before.
* While a Japanese or Chinese input method is composing, `Shift + Enter` keeps validating the composition.
* If the connection's *Carriage Return* is already set to `\n`, `Enter` and `Shift + Enter` send the same byte again.

## Turning it off
If a program you use expects `Shift + Enter` to behave like `Enter`:

* **Settings** > **Advanced Settings** > **SSH** > **Shift + Enter**
    * **New Line (Ctrl+J)**: the default
    * **Same As Enter**: the behaviour of the previous versions

The change applies to the next key press, there is no need to reconnect.
