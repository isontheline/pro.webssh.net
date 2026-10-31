---
title: Paste Clipboard Content
description: "How to paste clipboard content into the WebSSH terminal: long press or ellipsis menu on iPhone and iPad, Cmd + V or right click on Mac. Paste Special: paste the password, paste slowly for serial devices."
---

# How to paste clipboard content on the terminal?
## iOS
1. Show the contextual menu :
    1. Long press the terminal **OR**
    2. Tap the "..." ellipsis button
2. Choose "Paste" menu item

## macOS
* Show the contextual menu (right click) and the choose the "Paste" menu item **OR**
* Press `Cmd + V` **OR**
* Press `Cmd` and press your left mouse button

## Paste Special
The **Paste Special** submenu (contextual menu and "..." ellipsis button) offers :

* **Paste Password** : paste the password of the current connection (`⌥⌘P` on the Mac)
* **Paste Slowly** : send the clipboard in small chunks with a pause between them, for serial devices and retro computers that lose characters on a normal paste (`⌥⌘V` on the Mac)
* **Advanced Paste…** : choose the chunk size and the delays before pasting (`⌃⌥⌘V` on the Mac)

See [Paste Slowly](paste-slowly-serial-devices.md) for the details.[^1]

[^1]: Paste Slowly and Advanced Paste require WebSSH 33.3 or later.
