---
title: Split panes and Broadcast Input
seo_title: "Split Panes and Broadcast Input: Type into Several SSH Terminals at Once on Mac and iPad - WebSSH"
description: "Split a WebSSH window into two or four terminal panes on Mac and iPad, move between them with the keyboard, and turn on Broadcast Input (Pro) to send what you type to every pane at once."
---
# Split panes and Broadcast Input

??? abstract "What is it?"
    Since WebSSH 31.5[^1], a window can be split into several **panes**, each one hosting its own session (SSH, SFTP, Telnet, mosh, a text editor…) side by side. Since WebSSH 32.9[^2], **Broadcast Input** (Pro) replicates what you type in one pane to every terminal pane of the window: type `sudo apt upgrade` once, run it on four servers.

## Where it is available

| Platform | Split panes |
| --- | --- |
| **Mac** | Enabled by default |
| **iPad** | Opt-in: open the iPadOS **Settings** app > **WebSSH** > **Menus** > **Split Panes** > **Supported Platforms** and choose **macOS + iPadOS** |
| **iPhone** | Not available. Use tabs instead, see [Multiple connections](launching-multiple-terminals.md) |

The same **Split Panes** settings group also lets you choose on which side of the navigation bar the pane button appears (**Button Side**: left or right).

## Split a pane

Every pane shows a **pane button** (a split-window icon, labelled *Pane Options*) in its navigation bar. Its menu offers:

* **Split Vertically**: the pane is split into a left and a right pane
* **Split Horizontally**: the pane is split into a top and a bottom pane
* **Split 2×2**: the pane is split into four panes
* **Broadcast Input**: see [below](#broadcast-input-pro)
* **Close Pane**

On Mac, the same actions are listed in the menu bar under **View** > **Pane**.

The new pane opens on the **servers list**: tap a connection to launch it there. You can also pick a session from the sidebar: it opens in the pane that currently has the focus. A pane can be split again, as many times as the screen allows.

* **Resize**: drag the divider between two panes.
* **Focus**: tap or click a pane. The focused pane is the one with the solid border; it receives the keyboard and the sessions you launch from the sidebar.
* **SFTP side by side**: when split panes are enabled, the file browser opened from a terminal (**Browse Files**) appears in a new pane next to it, so you can drag and drop files between panes.

## Keyboard shortcuts

| Action | Shortcut |
| --- | --- |
| Split Vertically | <code>⌘D</code> |
| Split Horizontally | <code>⇧⌘D</code> |
| Split 2×2 | <code>⌥⇧⌘D</code> |
| Focus the pane on the left / right / above / below | <code>⌥⌘←</code> <code>⌥⌘→</code> <code>⌥⌘↑</code> <code>⌥⌘↓</code> |
| Broadcast Input (toggle) | <code>⌥⌘B</code> |
| Close Pane | <code>⇧⌘W</code> |

On iPad with a hardware keyboard, the shortcuts work once split panes are enabled in the settings. Focus navigation, Broadcast Input and Close Pane are only active while the window has more than one pane.

## Close a pane

**Close Pane** (<code>⇧⌘W</code>) removes the focused pane and gives its space to its neighbour. The last pane of a window cannot be removed: closing it brings back the servers list.

Closing a pane only removes it from the layout. A session that is still connected stays listed in the sidebar; select it there to show it again in the focused pane.

## Broadcast Input (Pro)

Broadcast Input sends what you type in the focused terminal to **every other terminal pane of the same window**. It needs at least two panes and a [WebSSH Pro](/documentation/pricing/) licence.

Turn it on (and off) from the pane button menu > **Broadcast Input**, from **View** > **Pane** > **Broadcast Input** on Mac, or with <code>⌥⌘B</code>.

### What is replicated

Everything sent by the focused terminal: keystrokes, the special keys of the keyboard accessory bar (<kbd>Ctrl</kbd>, <kbd>Esc</kbd>, arrows, function keys…), pasted text and [snippets](snippets.md). Each pane keeps showing its own output: only the **input** is shared.

While Broadcast Input is active, every participating pane shows a **dashed border** in the system accent colour (the focused pane keeps its solid border as well). Panes without a dashed border receive nothing:

* panes showing the servers list, a text editor or the file browser
* terminals that are not connected
* panes of **other windows or tabs**: Broadcast Input is per window

### When it turns off

Broadcast Input is never remembered: it is off when WebSSH starts and in every new window, and it switches itself off as soon as a window is back to a single pane. Turning it back on is one tap in the pane menu.

??? warning "Check the dashed borders before pressing Enter"
    Every pane with a dashed border gets the exact same keystrokes, whatever it is doing: a host sitting at a password prompt, another in `vim`, a third one at a root shell. A command meant for one server runs on all of them.

??? tip "Many hosts, no interaction needed?"
    When the command does not need a terminal (no prompt, no `sudo` password), [Run a command on multiple hosts](run-snippet-on-multiple-hosts.md) does the job in the background, without opening a single pane, and gathers the results in a report.

[^1]: Split panes require WebSSH 31.5 or later.
[^2]: Broadcast Input and the <code>⌥⌘</code> + arrow keys focus navigation require WebSSH 32.9 or later. Broadcast Input is a WebSSH Pro feature.
