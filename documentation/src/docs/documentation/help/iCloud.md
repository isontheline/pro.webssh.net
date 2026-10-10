---
title: iCloud
description: "Sync your WebSSH connections across your iPhone, iPad and Mac with iCloud. How to enable syncing and fix sync issues on macOS."
---

# iCloud
WebSSH supports iCloud and will sync your database across your devices. So when you add a connection on one of your device, this connection will be synced to your other devices seemlessly.

## Enabling syncing
By default your data are not synced with iCloud. To enable it, follow these steps :

1. Launch WebSSH
2. Go to Settings :gear:
3. Check "Enable iCloud" [^1]

??? warning "iCloud as Backup"
    iCloud shouldn't be used as a backup!

    WebSSH makes an [automatic backup](/documentation/help/howtos/automatic-database-backups/) of its database every day since version 32.2. You can also [make one by hand](/documentation/help/howtos/mashREPL/database-backup/) with mashREPL.

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