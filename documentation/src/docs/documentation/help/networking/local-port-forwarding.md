---
title: Local Port Forwarding
---

# Local Port Forwarding
!!! abstract "About SSH Tunneling"
    SSH Local Port Forwarding, also known as SSH Tunneling, is a technique that allows you to securely forward network traffic from a local port on your device to a remote host. 
    
    This can be useful in a variety of scenarios, such as accessing a service on a remote machine that is not directly accessible from your local device, or accessing a service securely over an untrusted network.

## How to use it?
1. Add a new tunnel by choossing **Tunnel** tab and by pessing the **+** button
2. Fill all required fields in order to establish the SSH connection
3. Finally choose the remote server port you want to forward locally by using the right syntax
4. Save the tunnel and launch it by tapping on it
5. You are now able to connect to your choosed local port

!!! tip "Port Forwarding Syntax"
    The Port Forwarding Syntax is as simple as : **LOCAL_PORT:REMOTE_SERVER:REMOTE_PORT**

## Local Port Forwarding Examples
| Forward Rule | Description |
| --- | --- |
| **8080:localhost:80** | Will forward remote port 80 (on the same server as the SSH one) to local port 8080 |
| **3389:localhost:3389** | Will forward remote port 3389 (on the same server as the SSH one) to local port 3389 |
| **2222:172.16.0.18:22** | Will forward remote port 22 (on the server 172.16.0.18) to local port 2222 |

!!! tip "Multiple forwards"
    Since WebSSH 17.3 you can add multiple forwards by either putting one forward per line or use the comma delimiter between them.
