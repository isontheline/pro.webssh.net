---
title: Run a command on multiple hosts
---

# Run a command (or a snippet) on multiple hosts

??? abstract "What is it?"
    Since WebSSH 33.0, a snippet — or a command typed for the occasion — can be run on **several saved connections at once**. WebSSH connects to each host in the background, runs the command **without opening a terminal**, and gathers every result in a single **report**: status, exit code, duration and output, host by host.

## Where to start from

There are three ways to open the *Run on Hosts* sheet:

1. **From a snippet**: in the *Snippets* section, tap a snippet (or choose **Run on Hosts** in its context menu; editing is there too). The hosts linked to the snippet through [tags](link-connections-using-tags.md) are preselected.
2. **From a selection of servers**: in the *Servers* section, choose **Select** in the `⋯` menu, tick the hosts, then tap the **▶︎** button in the navigation bar. The selection is preselected and you then pick a snippet, or type a command.
3. **From the Servers menu**: choose **Run on Hosts…** in the `⋯` menu of the *Servers* section, then pick everything in the sheet.

## The sheet

* **What to run**: a saved **Snippet** (chosen from your library), or a one-shot **Command** typed in the field. The last ten one-shot commands are kept under *Recent commands*; a one-shot command can later be turned into a snippet from the report (**Save as snippet**).
* **Where to run**: your SSH connections, grouped by [folder](arrange-connections-inside-folders.md), with a search field, tag chips and *Select all* buttons. Telnet and port forwarding entries are not listed.
* **Settings**: how many **hosts run in parallel** (1 to 8, default 4) and an optional **timeout per host** (none by default, up to 1 h): a long `apt upgrade` is never cut short by a guess, and **Stop** is always there for a command that hangs. Both are remembered.

Tap **Run on N hosts**. If the command uses [dynamic variables](snippets.md#dynamic-variables), the usual form appears **once**: the values you type apply to every host. The built-in variables (`{{{ HOST }}}`, `{{{ USER }}}`, `{{{ PORT }}}`, `{{{ CONNECTION }}}`, `{{{ DATE }}}`) are not asked: they are filled **per host** from each connection.

## Confirmation

Before anything is sent, WebSSH shows the command (secret values masked) and the list of hosts. When the command looks destructive (`rm -rf`, `mkfs`, `reboot`, `apt … -y`, `docker prune`, `qm destroy`…), the sheet turns red and asks for a **second tap**: there is no undo on twenty servers.

## The report

The report is a session like any other: it stays listed in the sidebar (and in the windows menu on iPhone) while the run is alive, and you can leave it and come back.

* A summary: hosts done, failed and left, a progress bar, the elapsed time.
* One row per host: status, exit code, duration; tap it to see the output (stdout and stderr, colours stripped), live while the command runs. Long press a row to copy its output or its command.
* The `⋯` menu: **Re-run failed hosts**, **Re-run all hosts**, **Copy full report**, **Share** (a text file), **Save as snippet** for a one-shot command.
* **Stop** cancels the hosts still waiting and tears down the commands still running.

Each host connection is closed as soon as its command ends: nothing stays open once the report is complete.

## How hosts are connected

Every host goes through the same pipeline as a terminal session: `ssh_config` overrides, private keys, jump hosts, port knocking, DNS strategy… Connections are established **one after the other** — so that a password or host key prompt never collides with another one — and the commands then run **in parallel**, up to the number of hosts you chose. A prompt (unknown host key, missing password, challenge) is shown for the host that needs it; cancelling it marks that host as *Cancelled* and the run goes on with the others.

## Limits

* **No terminal, no PTY**: the command runs on an SSH *exec* channel. Interactive programs (`top`, `vim`, `tmux`…), `sudo` asking for a password and any prompt will block until the timeout. Prefer `sudo -n`, `apt-get -y`, `DEBIAN_FRONTEND=noninteractive`… or set up `NOPASSWD` in `sudoers`.
* **Snippets sending key strokes** (`<ctrl-…>`, `<esc>`, `<tab>`…) are refused: they need a terminal.
* **Timeout**: off by default. When set, a command still running after the timeout is stopped (the channel is closed, which ends the remote process) and reported as *Timed out*.
* **Output** is kept up to 256 KB per host.
* **mosh** and **Telnet** connections are not eligible.

!!! tip "Interactive work on a few hosts"
    When you need to *see* and *drive* what happens (an upgrade asking questions, for example), open the sessions side by side on iPad or Mac and use **Terminal Broadcast Input** (`⌥⌘B`): what you type goes to every pane.
