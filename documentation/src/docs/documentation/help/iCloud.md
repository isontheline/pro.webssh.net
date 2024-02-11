---
title: iCloud
---

# iCloud
WebSSH supports iCloud and will sync your database across your devices. So when you add a connection on one of your device, this connection will be synced to your other devices seemlessly.

## Enabling syncing
By default your data are not synced with iCloud. To enable it, follow these steps :

1. Launch WebSSH
2. Go to Settings :gear:
3. Check "Enable iCloud" [^1][^2]

!!! warning "iCloud as Backup"
    iCloud shouldn't be used as a backup!

    Instead you should use mashREPL in order to [make a backup](/documentation/help/howtos/mashREPL/database-backup/) of the WebSSH database.

??? tip "Syncing doesn't work on my macOS"
    If the sync doesn't work on your macOS device, please check the following steps :

    1. System Settings
    2. Apple ID
    3. iCloud
    4. iCloud Drive
    5. Setting
    6. Check that "WebSSH" switch is enabled in order to allow WebSSH to use iCloud

??? info "About iCloud Encryption"
    WebSSH uses CloudKit to sync your data with iCloud. CloudKit is a service provided by Apple that allows you to store data securely in the cloud and sync it across your devices.

    You can read more about CloudKit [here](https://support.apple.com/en-qa/guide/security/sec3cac31735/1/web/1).
    

[^1]: In order to use this functionality, you must upgrade WebSSH to 14.15
[^1]: Available on WebSSH and eWebSSH but NOT available on WebSSH::o