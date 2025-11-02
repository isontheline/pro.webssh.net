---
title: FAQ
---

# FAQ - Frequently Asked Questions
??? abstract "Does WebSSH support ZMODEM, YMODEM or XMODEM transfers?"
    Unfortunately, WebSSH does not support ZMODEM, YMODEM or XMODEM transfers.
    A GitHub issue could be find to track this feature request : [#761](https://github.com/isontheline/pro.webssh.net/issues/761)

??? abstract "How can I lock access to the app?"
    Since WebSSH 30, the access lock feature rely on iOS / iPadOS 18 built-in "Lock an app" feature. To use it, please refer to the following Apple documentation :

    * [iPad User Guide](https://support.apple.com/en-gw/guide/ipad/ipad4026f2de/ipados)
    * [iPhone User Guide](https://support.apple.com/en-gw/guide/iphone/iph00f208d05/ios)

    If you are using an older version of iOS or iPadOS, or if you are running macOS, you can use the built-in lock feature inside WebSSH :

    1. Open WebSSH
    2. Go to Settings
    3. Enable Face ID / Touch ID / Password Lock

??? abstract "Is it possible to force WebSSH to use IPv4 instead of IPv6 when connecting to a host?"
    Yes, it is possible to force WebSSH to use IPv4 instead of IPv6 when connecting to a host.

    To do so, please follow these steps :

    1. Go to WebSSH Settings
    2. Internet Protocol Strategy
    3. Choose "Try IPv4 host address before IPv6" or "Only use IPv4 for resolution"

    Once done, WebSSH will prioritize IPv4 connections when both IPv4 and IPv6 are available for a host.

??? abstract "Does WebSSH support Agent Forwarding?"
    Unfortunately, WebSSH does not support SSH Agent Forwarding at this time.

    A GitHub issue could be find to track this feature request : [#754](https://github.com/isontheline/pro.webssh.net/issues/754)

??? abstract "How can I check that I own the PRO version of WebSSH?"
    To verify that you own the PRO version of WebSSH, please follow these steps:

    1. Open WebSSH on your device.
    2. Navigate to the "Settings" section (gear icon).
    3. Go down the "App Store" section
    4. If you have purchased the PRO version, you should see the message "Thank you for your purchase!" which confirms that the PRO features are unlocked.