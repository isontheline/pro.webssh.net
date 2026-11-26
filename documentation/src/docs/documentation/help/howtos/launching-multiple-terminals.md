---
title: Multiple connections
description: "Run several SSH or SFTP connections at the same time in WebSSH: windows, tabs and split panes on Mac, sidebar, split panes and Split View on iPad, multiple windows on iPhone."
---
# How to launch multiple SSH or SFTP connections?

## macOS
In order to use multiple features at same time (SSH, SFTP, mashREPL, ping, ...) on macOS, you can either :
* launch a new window (<code>Cmd + N</code>) 
* launch a new tab (<code>Cmd + T</code>) 
* switch to a tab (<code>Cmd + 1</code> … <code>Cmd + 8</code>, <code>Cmd + 9</code> for the last tab)
* split the current window into panes (<code>Cmd + D</code>) to see several sessions side by side, see [Split panes and Broadcast Input](split-panes-and-broadcast-input.md)

## iPad
On iPad you can also use multiple connections :
* Use the sidebar to switch between connections
* Use the three dots "..." on top on your iPad status bar then press (+) to add a new window or choose to split the screen
* Use Stage Manager (when available)
* Split the WebSSH window itself into panes (opt-in in the settings), see [Split panes and Broadcast Input](split-panes-and-broadcast-input.md)

## iPhone
On iPhone it's also easy as :

1. Launch a SSH or SFTP connection
2. Press the "multiple windows" top left icon on the navigation bar
3. Choose "New tab"
4. Launch another SSH or SFTP connection
5. Switch between connections by using the "multiple windows" top left icon on the navigation bar


## Open all the connections of a group

Since WebSSH 33.5 the connections of a [group](arrange-connections-inside-folders.md) can be opened in one go, one after the other. This is a PRO feature: the menus are shown to everyone, and the upgrade is offered when an entry is chosen.

### From the group title

In the *Servers* section, each group title has a `⋯` button **just before its name**. Its menu offers:

* **Open All in Tabs** (macOS): one tab per connection, in the current window
* **Open All in This Window** (macOS) or **Open All** (iPad, iPhone): every session is opened in the current window and stays reachable from the sidebar, or from the "multiple windows" icon on iPhone
* **Open All in Split View** (macOS and iPad, when [split panes](split-panes-and-broadcast-input.md) are enabled): from 2 to 4 connections side by side

Good to know:

* Each entry shows how many connections it is about to open. Only the connections **currently shown** in the group are opened: the search field and the *Favorites* / *SSH* / *SFTP* tabs narrow them down.
* A subgroup is a group of its own: `PROD` does not open `PROD / WEB`.
* The button is not shown for connections that have no group, nor on the *Recents* tab.
* Above 8 connections, WebSSH asks for a confirmation first.
* A connection that fails does not stop the others: the progress sheet lists them and offers **Retry Failed Connections**. The cross on a row gives up on that connection only.

### From a selection

To pick the connections by hand, possibly across several groups:

1. Choose **Select** in the `⋯` menu of the *Servers* section, or hold <code>Cmd</code> and click a connection (Mac, or iPad with a keyboard)
2. Tick the connections
3. Use the **Open** button of the navigation bar (the stacked rectangles): it offers the same entries as above

The other buttons of the selection bar are **Run on Hosts** (see [Run a command on multiple hosts](run-snippet-on-multiple-hosts.md)), **Color**, **Delete**, and **Edit** when a single connection is ticked. **Cancel** leaves the selection.

### Port forwardings

The *Forwardings* section has the same button on its group titles and in its selection bar, with **Start All** and **Stop All**. **Start All** leaves the forwardings that are already running alone. **Stop All** is available to everyone.
