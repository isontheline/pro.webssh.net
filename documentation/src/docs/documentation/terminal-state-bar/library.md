---
title: State Bar Library
---
# WebSSH Library for the State Bar
Since WebSSH 32.10, the **WebSSH Library** is a catalog of ready-made [State Bar](index.md) items, maintained by the WebSSH team: system load, memory, disk usage rings, pending updates, Docker and Proxmox health, weather, status pages, Home Assistant… You import an item in one tap, no script to copy.

The catalog is public: it lives in the [`statebar` folder](https://github.com/isontheline/pro.webssh.net/tree/master/statebar) of the WebSSH documentation repository, where every script can be read and where you can [propose your own](https://github.com/isontheline/pro.webssh.net/blob/master/statebar/README.md).

## Browse the library
1. Go to Settings → Terminal → State Bar (or tap Customize in the State Bar menu of any terminal).
2. Tap the add button (top right), then **WebSSH Library**.
3. Pick a collection, or search across the whole library. The chips filter by kind: **SSH** and **mosh** tell on which sessions an item is useful, **HTTP** marks items that call a web service, the others are the systems the remote commands need.

The sheet of an item shows what it does, the packages its commands rely on, its refresh interval, the **hosts it contacts** and the **variables** it will ask for. Tap the script to read it in full. The Safari button opens the same page on GitHub.

An internet connection is needed to browse the library; imported items then work like any other item.

## Import an item
Tap **Import**. Depending on the item, WebSSH asks two things:

* **Variables**: the values the script needs (a city, a URL, a repository, a token…). You can change them later in the item editor, see [Variables](index.md#variables).
* **Allow Network Access?**: for an item that calls a web service, the question lists the hosts it will contact. **Allow** turns [Network Access](index.md#network-access) on for this item, limited to these hosts. **Don't Allow** imports the item with Network Access off: it shows nothing until you turn it on in the item editor.

The item is added at the end of your list, for every connection (tags `*`), with its icon, refresh interval and graph setting. It is then yours: rename it, move it, change its [appearance](index.md#appearance), its tags or even its script.

!!! note "Remote commands"
    Items marked **SSH** run commands on your server, exactly like your own items. Scripts of the library are reviewed and only read information; they never change anything on the server. Some need a package to be installed, shown on the item sheet.

## Update an item
An imported item remembers where it comes from.

* Import it again from the library: WebSSH offers to **overwrite** it.
* Or long press (right click) the item in your list → **Refresh from Source**.

In both cases only the script is replaced. The name, tags, icon, appearance, refresh interval, position and the values of your variables are kept. If the new version contacts other hosts, the network question is asked again.

An item whose script you edited yourself is overwritten by an update: duplicate it first if you want to keep your changes (create an item and paste the script).
