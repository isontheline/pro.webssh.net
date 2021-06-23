---
title: iCloud
---

# iCloud
!!! warning "iCloud as Backup"
    iCloud shouldn't be used as a backup!

    Instead you should use mashREPL in order to [make a backup](/documentation/help/howtos/mashREPL/database-backup/) of the WebSSH database.

WebSSH supports iCloud and will sync your database across your devices. So when you add a connection on one of your device, this connection will be synced to your other devices seemlessly.

## Enabling syncing
By default your data are not synced with iCloud. To enable it, follow these steps :

1. Launch WebSSH
2. Go to Settings :gear:
3. Go to iCloud[^1]
4. Check "Enable iCloud"

[^1]: In order to use this functionality, you must upgrade WebSSH to 14.15