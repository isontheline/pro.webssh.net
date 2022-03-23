---
title: iCloud
---

# iCloud
WebSSH supports iCloud and will sync your database across your devices. So when you add a connection on one of your device, this connection will be synced to your other devices seemlessly.

## Enabling syncing
By default your data are not synced with iCloud. To enable it, follow these steps :

1. Launch WebSSH
2. Go to Settings :gear:
3. Go to iCloud[^1]
4. Check "Enable iCloud"

!!! tip "Syncing doesn't work on my macOS"
    If the sync doesn't work on your macOS device, please check the following steps :

    1. System Settings
    2. Apple ID
    3. iCloud
    4. iCloud Drive
    5. Setting
    6. Check that "WebSSH" switch is enabled in order to allow WebSSH to use iCloud

!!! warning "iCloud as Backup"
    iCloud shouldn't be used as a backup!

    Instead you should use mashREPL in order to [make a backup](/documentation/help/howtos/mashREPL/database-backup/) of the WebSSH database.

[^1]: In order to use this functionality, you must upgrade WebSSH to 14.15