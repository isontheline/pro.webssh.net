---
title: Terminal State Bar
---
# Terminal State Bar
Since WebSSH 29.3 a "State Bar" is available at the top (iOS / iPadOS) or bottom (macOS) of the terminal. It displays near real-time information about the current session: built-in items provided by WebSSH, and your own items written in JavaScript.

!!! info "In this section"
    * This page: how the State Bar works, how to show / hide it, and how to compose it.
    * [JavaScript API](javascript-api.md): everything your own items can use (`$ssh`, `$mosh`, `$terminal`, `$vars`, `console`).
    * [Examples](examples.md): ready to paste items.

## Anatomy of the State Bar
From left to right:

1. **Menu button** (waveform icon): opens the State Bar menu (Refresh, Pause / Resume, hide the bar, Help, Restart, Settings). It is the only fixed element: it always sits on the left and cannot be removed.
2. **Your list of items**, in the order you chose, scrolling horizontally when they do not fit: [system items](#system-items), [built-in items](#built-in-items), [layout items](#layout-items) and [your own items](#your-own-items). On macOS and iPadOS with a pointer, the item under the cursor is highlighted. An item can be tinted (orange, red, green), carry a badge, a progress ring or a sparkline, and has its own [appearance](#appearance).

Until 32.10 the connection information, the progress and the recording button were fixed next to the menu button. They are now ordinary items: move them, restyle them or remove them.

## Show or hide the State Bar
The State Bar is enabled by default. Three levels control it:

* **Global setting**: Settings → Advanced Settings → SSH → *State Bar Strategy*: **Visible** (shown when the terminal opens), **Hidden** (available, but hidden until you show it) or **Disabled** (never available).
* **Per connection**: the *State Bar* option in the terminal section of the connection form: **Inherit** (use the global setting), **Enabled**, **Hidden** or **Disabled**.
* **In the terminal**: the *State Bar* entry of the terminal menu (⋯) toggles the bar for the current session, and the bar's own menu can hide it too.

One more setting lives next to *State Bar Strategy*:

* **State Bar Background Color**: use the terminal selection color (default) or the terminal background color. The foreground color is adjusted automatically when the contrast is not sufficient.

The former *Recording Button* setting is gone: keep or remove the **Recording** item in your list instead.

!!! warning "Not available for every session"
    The State Bar is not available when the session goes through a jump host ("Connect Through"), nor on Telnet sessions. It is available on SSH and mosh sessions.

## Compose the State Bar
1. Go to Settings → Terminal → State Bar (or tap Settings in the State Bar menu of any terminal).
2. Use the add button (top right):
    * **Add**: create your own item, written in JavaScript (see below).
    * **Built-in Items**: pick an item provided by WebSSH (see below).
3. Drag the handles to reorder the items. Long press (or right click) an item to delete it.

Changes are saved immediately and synchronized through iCloud like the rest of your data. When the settings were opened from a State Bar menu, that bar is rebuilt when you leave them; other open terminals pick up the changes with Restart in their State Bar menu.

!!! tip "First launch"
    Until you compose your own list, the State Bar shows **Connection info**, **Progress** and **Recording** as blocks next to the menu button, then **Connection**, a **Flexible Space** and **Terminal size**, which puts the terminal size on the right edge. If you already had a list before 32.10, the three system items were added once at its head, so your bar looks the same as before.

## System items
Since WebSSH 32.10, the three elements that used to be fixed are items of the *Built-in Items* picker (section *System*). Their content is driven by the terminal, not computed every 3 seconds. Each can be added once.

| Item | Shows | Tap |
| --- | --- | --- |
| Connection info (since 32.9) | Icon only when everything is fine, icon + label when the state degrades (orange for a warning, red for an error, for example a mosh session waiting for the server or a lost SSH connection) | Opens the connection information sheet (key exchange, cipher, host key fingerprint, jump hosts, mosh transport…) |
| Progress | Only visible while a job reports its progress through the [`OSC 9;4` escape sequence](/documentation/terminal-progress-bar/): ring + percentage, red triangle on error, orange pause icon, spinner when indeterminate, green check when the job completes | None. Its context menu clears a stuck indicator |
| Recording | Record icon, red while recording | Start / stop a session recording, add markers, review or list recordings |

Removing *Connection info* does not remove the feature: the sheet stays available from the terminal menu (⋯).

## Built-in items
Since WebSSH 32.10, built-in items are provided and computed by WebSSH itself. They cannot be edited (a lock is shown in the list) but they can be reordered and deleted, and they are updated automatically with the app: no JavaScript involved.

| Item | Shows | Available on |
| --- | --- | --- |
| Connection | The connection icon and name (or host when the name is empty) | All sessions |
| Duration | Time elapsed since the session started | All sessions |
| Address | The resolved address handed to the SSH engine. With the *passthrough* DNS strategy this is the hostname itself | SSH |
| Terminal size | Columns × rows | All sessions |
| User | The login user | SSH, mosh |
| Server identifier | The SSH server banner (eg. `SSH-2.0-OpenSSH_9.6`) | SSH, mosh (bootstrap) |
| Cipher | The negotiated cipher (incoming / outgoing when they differ) | SSH, mosh (bootstrap) |
| Round-trip time | The smoothed round-trip time of the mosh transport. Numeric: can show a [sparkline](#graph) | mosh |
| Date & Time | The local date and time of the device, with settings: date style, time style, seconds, or a custom pattern. Refreshed on the 3 seconds tick, so seconds can lag a little | All sessions, can be added several times |
| Ephemeris | Sunrise and sunset, the next sun event, the day progress (a ring filling from sunrise to sunset with the remaining daylight as label), or the moon phase. Computed on the device from a latitude / longitude entered in the settings: no network, no location permission | All sessions, can be added several times |

An item that does not apply to the current session is simply hidden. Each built-in item can be added only once, except Date & Time and Ephemeris.

### Built-in item settings
Tap a built-in item in the list (or Edit in its context menu) to open its settings: a live preview at the top when the item has parameters (Date & Time, Ephemeris), its [appearance](#appearance), the *Graph* setting for numeric items (Round-trip time), then the item's own parameters. Settings are saved when you leave the sheet and synchronized with the rest of the item.

### Layout items
Three built-in items only affect the layout and can be added as many times as you want:

* **Separator**: a thin vertical line, to delimit groups of items.
* **Space**: a small fixed gap between two items.
* **Flexible Space**: pushes the items on either side of it apart. One flexible space aligns everything after it to the right edge; two of them center what stands between them. When the items do not fit in the bar, flexible spaces collapse and the bar scrolls as usual.

## Appearance
Since WebSSH 32.10, every item (system, built-in or your own) has three appearance settings. For your own items they are in the item editor; for the others, tap the row in the list to open their settings.

* **Style**: **Plain** (content only, the default), **Bordered** (thin rounded outline), **Filled** (light rounded background) or **Block** (full height background and a separator, the look of the former fixed elements, which is why the system items start with it). A `tint` returned by a script still colours every style.
* **Content**: **Icon and label**, **Icon only** or **Label only**, to compact a busy bar without touching the script. A progress ring or a badge stays visible in *Label only*, as they live in the icon slot.
* **Maximum label width**: truncates a long label with … beyond 80, 120, 160 or 240 points. Tapping the item still copies the full label.

As every non-layout item now has settings, they show a chevron in the list; only layout items keep the lock.

## Your own items
Since WebSSH 29.3 you can write your own items. An item is defined by:

* **Name**: only used to identify the item in the settings (and as the title of the menu shown when you tap the item).
* **Tags**: link the item to one or more connections. Read more about [WebSSH Tags](/documentation/help/howtos/link-connections-using-tags/). Leave empty (or `*`) to show the item on every connection.
* **Icon**: the [SF Symbol](https://developer.apple.com/sf-symbols/) displayed before the label. The script can change it at every run. The icon row shows the symbol name, and in the icon picker a long press (or right click) on any symbol shows its name with a *Copy name* action: handy to find the names a script can return in `icon`, no Mac needed. The picker's list mode shows all the names.
* **Graph**: off by default. See [below](#graph).
* **JavaScript**: the code executed to compute the item. See the [JavaScript API](javascript-api.md) and the [examples](examples.md).

A script can also colour its item (`tint`), add a badge on the icon or replace the icon with a progress ring: see the [Item Result Object](javascript-api.md#item-result-object).

### Graph
Since WebSSH 32.10, an item can draw a **sparkline** of its last values without any work in the script: WebSSH keeps the last 30 numeric values (the `value` field of the result, or the first number found in the label) and draws a small curve next to the label. Three modes: **Off**, **Sparkline** (label + curve) and **Sparkline only** (the curve replaces the label). The history lives in memory: it starts again when the bar is restarted or the session reopened. When the values barely move (less than 5 %), a flat line is drawn instead of amplifying noise.

### Test your item
Since WebSSH 32.10 you can test an item while you write it, without saving anything. The test needs a session that is already open (SSH or mosh, where the State Bar is available): with no open session the test is not offered.

* In the item editor, tap **Test** under the script.
* In the script editor, tap the **▶︎** button: it runs the text being edited, saved or not. On iPhone and iPad the panel opens half height and the script stays editable behind it.

The panel runs the script on the selected session exactly like the State Bar does, remote commands included, and shows:

* the **real rendering** of the item with the colours of that session's theme (tint, badge, progress ring, sparkline);
* the **returned value** and whether the item is shown or hidden;
* the **duration** of the run, orange above 1 second and red above 3 seconds;
* the **console** output (`console.log`, `console.warn`…);
* **errors** with their line and column: from the script editor, tap the error to jump to the line;
* **warnings** for values WebSSH tolerates but you probably did not intend: unknown SF Symbol, unknown `tint`, `progress` outside 0…1, long badge.

**Run once** executes a single run. **Run every 3 seconds** reproduces the tick of the bar, which scripts keeping state in `$vars` and sparklines need. The `$vars` of the test persist between runs and are separate from the real bar; **Reset** clears them along with the sparkline history and the console.

Leaving the item editor with unsaved changes now asks to save, discard or cancel.

Your items are re-computed every 3 seconds while you are not typing. Typing in the terminal pauses the updates until you stop. The Pause entry of the State Bar menu pauses them explicitly (diagonal stripes are drawn over the bar), Refresh forces a run, Restart rebuilds the bar.

Tap an item to copy its label; right click (or long press) offers the same.

## Known Issues / Limitations
* When using `$ssh.exec`, avoid long running commands: they block the State Bar until they finish. Use the [Linux `timeout`](https://www.man7.org/linux/man-pages/man1/timeout.1.html) command to limit the execution time.
* The State Bar is not available through a jump host ("Connect Through"), nor on Telnet sessions.
* On a mosh session, `$ssh.exec` always returns `null` (there is no SSH session any more once mosh-server is started). See [`$mosh`](javascript-api.md#mosh).
* With poor or no network, `$ssh.exec` may freeze the State Bar and other UI elements. Disable the State Bar for that connection to avoid it.
