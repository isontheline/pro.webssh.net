---
title: Restoring Purchases
---

# Restoring Purchases

??? info "WebSSH PRO is a lifetime purchase"
    Don't worry if you have lost your device or if you have changed your device, you can restore your purchase on any device you want. You only need to use the same Apple ID that you have used to buy WebSSH PRO.

    I'm always [here](mailto:team@webssh.net) to help you if you have any issue about restoring your purchase.

??? warning "TestFlight purchase restoration isn't supported"
    If you are using TestFlight and want to restore or buy WebSSH PRO, please re-install WebSSH from the App Store and then restore / buy your purchase.

    NEVER remove WebSSH! Just install it again from the App Store or, you will lose your data!

## Restoring on another platform (iOS <=> macOS)
If you have already bought WebSSH on another platform (iOS <=> macOS) and you are encountering an issue about restoring your purchase, you may try the following steps :

* On **the device you have bought** the PRO purchase originally :
    1. Launch WebSSH
    2. Launch mashREPL tool
    3. Type `webssh store update`
    4. Type `webssh store sync`

* On the device you want to restore the purchase :
    1. Launch WebSSH
    2. Wait 30 to 60 seconds
    3. Go to Settings :gear:
    4. Check that the PRO purchase is already unlocked : "Thank you for your purchase!"

??? question "These steps doesn't work ?"
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

## Restoring on the original device
Please check that you are using the same Apple ID on the original device that you have used to buy WebSSH.

Then, you can try the following steps :

1. Launch WebSSH
2. Go to Settings :gear:
3. Tap on "Restore Purchases"
4. You should see a message "Thank you for your purchase!"

??? question "These steps doesn't work ?"
    Forward me by [email](mailto:team@webssh.net) your original purchase receipt and I will assist you as much as you need.

[^1]: In order to use this functionality, you must upgrade WebSSH to 14.15