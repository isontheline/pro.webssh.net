---
title: FAQ
---

# FAQ - Frequently Asked Questions
:sparkles: <a href="#" onclick="javascript:showDocumentationAssistant(); return false;">AI Documentation Assistant</a> is at your disposal - ask away with any WebSSH questions that come to mind!

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

??? abstract "Does Dynamic Port Forwarding forwards all my device traffic?"
    No, Dynamic Port Forwarding (DPF) in WebSSH only forwards traffic from subsequent connections made within WebSSH app itself. It does not route all device traffic through the SSH tunnel. So DPF could act as a bastion host to access remote services from within WebSSH.

??? abstract "How can I enable Dynamic Port Forwarding?"
    1. Add a new tunnel by choosing **Tunnel** tab and by pressing the **+** button
    2. Enable DPF forwarding by using "*" as the Port Forwarding rule
    3. Save the tunnel
    4. Launch your DPF forward (tap on it)
    5. Open any SSH or SFTP connection, it will go through the DPF forward

    More information about DPF is available here : [Dynamic Port Forwarding (DPF)](/documentation/help/networking/dynamic-port-forwarding/)

??? abstract "How can I check that I own the PRO version of WebSSH?"
    To verify that you own the PRO version of WebSSH, please follow these steps:

    1. Open WebSSH on your device.
    2. Navigate to the "Settings" section (gear icon).
    3. Go down the "App Store" section
    4. If you have purchased the PRO version, you should see the message "Thank you for your purchase!" which confirms that the PRO features are unlocked.

??? abstract "What are snippets?"
    Snippets are reusable pieces of code / commands / scripts that can be quickly inserted into your terminal session. They help you save time by allowing you to reuse commonly used commands without having to type them out each time.

??? abstract "Does the backspace key could repeat when held down?"
    No, the backspace key does not repeat when held down in WebSSH. This is a limitation of the current implementation.

??? abstract "Can I use the ssh_config file to establish connections?"
    No, WebSSH doesn't use the ssh_config file to establish connections. Each connection in WebSSH is configured individually within the app itself.

    The ssh_config file is ONLY used to define or override default values for your connections when launching them.

    For more information about using ssh_config file in WebSSH, please refer to this documentation : [SSH Config File](/documentation/help/SSH/ssh-config-file/)

??? abstract "Can I define a Private Key inside the ssh_config file to be used globally for all connections?"
    No, WebSSH does not support - yet - defining a Private Key inside the ssh_config file for global use across all connections.
    I hope to add this feature in a future release.

??? abstract "How can I send a Return (Enter) key in a WebSSH snippet?"
    To send a Return (Enter) key in a WebSSH snippet, simply make a carriage return (new line) in the snippet editor where you want the Return key to be sent.

??? abstract "How can I arrange or update my server list in WebSSH?"
    WebSSH doesn't currently support arranging the server list manually. Servers are sorted alphabetically by default. However, you can use folders and tags to organize your servers into categories for easier access.

??? abstract "Do you offer student or educator discounts for WebSSH PRO?"
    Yes, students and educators can qualify for a discount on WebSSH PRO. Please refer to the [Pricing Documentation](/documentation/pricing/) for more details and the redeem link.

??? abstract "How can I prevent WebSSH disconnecting when switching apps on iPad or iPhone?"
    This is a limitation imposed by iOS and iPadOS operating systems. They have strict background execution limits for apps, about 30 seconds. After this time, the OS may suspend the app to save resources, which can lead to disconnections.

    On iPad you could use Split View or Slide Over to keep WebSSH active while using another app. This way, WebSSH remains in the foreground and is less likely to be suspended.

??? abstract "How can I quickly copy text from the WebSSH terminal on iOS or iPadOS?"
    Just use the standard text selection gestures of iOS / iPadOS to make a selection in the terminal, then tap "Copy" from the context menu that appears.

    If you want a better experience or to copy large amounts of text, you can use the top "..." menu, then choose "Copy" and select "Show Scrollback Buffer". This will open the full scrollback buffer in a separate view where you can easily select and copy large amounts of text.