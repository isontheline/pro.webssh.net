---
title: Database Restore
---

# How to restore a backup of the WebSSH database?
1. Launch WebSSH
2. Start a mashREPL instance :fontawesome-solid-terminal:
3. Type the following command[^1] : webssh database restore `<webssh.db>`

`<webssh.db>` is the name of your WebSSH database file you want to restore.

!!! warning "iCloud Sync"
    If you have iCloud enabled inside WebSSH settings, you should disable it and enable it again after the database restore in order to sync restore changes with all your devices.

    Older connections on iCloud won't be deleted after a database restoration, they will be merged instead.

[^1]: In order to use this functionality, you must upgrade WebSSH to 14.15