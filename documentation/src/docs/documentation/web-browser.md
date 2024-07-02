---
title: Web Browser
---
# Web Browser
Since WebSSH 23.8 you can now use an embedded Web Browser[^1] to access your websites.

The main goal is to be able to access your websites seemlessly through a secure SSH tunnel (aka [Dynamic Port Forwarding](/documentation/help/networking/dynamic-port-forwarding/)) like you would do with a SOCKS proxy.

This feature is still in progress and will be enhanced in the future. All [feedbacks](/support/) are welcome!

## Use your SSH Server as a Web Proxy / VPN
1. [Create a Dynamic Port Forwarding tunnel](/documentation/help/networking/dynamic-port-forwarding/)
2. Launch the tunnel
3. Open the WebSSH embedded Web Browser, two options to open it :
    1. Long press (iOS) or right click (macOS) on the tunnel and then choose "Web Browser"
    2. Go to the "Tools" section of WebSSH and then choose "Web Browser"
4. Use the navigation address bar to access your websites through your SSH server

[^1]: Requires at least iOS 17 or macOS 14