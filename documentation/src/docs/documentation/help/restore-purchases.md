---
title: Restore Purchases
---

# Restore Purchases
If you are encountering an issue with your purchase, you can restore your purchases by following these steps:

* On the device you have bought the PRO purchase :
    1. Launch WebSSH
    2. Launch mashREPL tool
    3. Type `webssh store update`
    4. Type `webssh store sync`

* On the device you want to restore the purchase :
    1. Launch WebSSH
    2. Wait 30 to 60 seconds
    3. Go to Settings :gear:
    4. Check that the PRO purchase is already unlocked : "Thank you for your purchase!"

!!! warning "Restore Purchases doesn't work on my device"
    If the restore doesn't work on your device, please check the following steps :

    1. System Settings
    2. Apple ID
    3. iCloud
    4. Apps Using iCloud
    5. Check that "WebSSH" switch is enabled in order to allow WebSSH to use iCloud

    Then go back to WebSSH and do the following steps :

    1. Go to Settings :gear:
    2. Go to iCloud[^1]
    3. Check that iCloud is enabled

    Now you can try to restore your purchase again.

[^1]: In order to use this functionality, you must upgrade WebSSH to 14.15