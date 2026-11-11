---
title: Database Restore
---

# How to restore a backup of the WebSSH database?
1. Launch WebSSH
2. Start a mashREPL instance :fontawesome-solid-terminal:
3. Type the following command[^1] : webssh database restore `<backup>`

`<backup>` is the name of the backup you want to restore: a `.wsbk` file (encrypted, since WebSSH 33.4) or an older `.db` file.

An encrypted backup made on this device restores without asking for anything. mashREPL never asks for a password: when the backup was encrypted with another password (another device, or a password you have changed since), the command stops and tells you to restore it from **Settings ▸ Maintenance ▸ Local Database**, which asks for the password.

The database being replaced is backed up first, so a restore can be undone.

??? info "Restore from the Settings"
    Since WebSSH 32.2 the backups, automatic or manual, are listed in **Settings ▸ Maintenance ▸ Local Database**, where a long press on a backup offers **Restore**. See [Automatic Database Backups](/documentation/help/howtos/automatic-database-backups/).

!!! warning "iCloud Sync"
    If you have iCloud enabled inside WebSSH settings, you should disable it and enable it again after the database restore in order to sync restore changes with all your devices.

    Older connections on iCloud won't be deleted after a database restoration, they will be merged instead.

[^1]: In order to use this functionality, you must upgrade WebSSH to 14.15