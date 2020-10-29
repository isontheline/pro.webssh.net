---
title: Port Forwarding
---
!!! info "About Tunnel feature (a.k.a Port Forwarding)"
    WebSSH’s Tunnel feature will let you to enable [Local Port Forwarding](https://en.wikipedia.org/wiki/Port_forwarding#Local_port_forwarding).

    Local port forwarding will let you to connect from your iDevice to another server while data is securely forwarded using SSH protocol.

# How to use it?
1. Add a new tunnel by choossing **Tunnel** tab and by pessing the **+** button
2. Fill all required fields in order to establish the SSH connection
3. Finally choose the remote server port you want to forward locally by using the right syntax

!!! tip "Port Forwarding Syntax"
    The Port Forwarding Syntax is as simple as : **LOCAL_PORT:REMOTE_SERVER:REMOTE_PORT**

    **Examples :**

    * **8080:localhost:80** will forward remote port 80 (on the same server as the SSH one) to local port 8080
    * **3389:localhost:3389** will forward remote port 3389 (on the same server as the SSH one) to local port 3389

# How it works?