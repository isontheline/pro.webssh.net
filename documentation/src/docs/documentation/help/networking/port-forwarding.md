---
title: Port Forwarding
---

# Port Forwarding
!!! abstract "About Tunnel feature (a.k.a Port Forwarding)"
    WebSSH's Tunnel feature will let you to enable [Local Port Forwarding (LPF)](https://en.wikipedia.org/wiki/Port_forwarding#Local_port_forwarding) and [Dynamic Port Forwarding (DPF)](https://en.wikipedia.org/wiki/Port_forwarding#Dynamic_port_forwarding).
    LPF and DPF will let you to connect from your iDevice to another server while data is securely forwarded using SSH protocol.

## Local Port Forwarding
Local Port Forwarding will forward a local port on your iDevice to a remote IP and port through your SSH server.

### How to use it?
1. Add a new tunnel by choossing **Tunnel** tab and by pessing the **+** button
2. Fill all required fields in order to establish the SSH connection
3. Finally choose the remote server port you want to forward locally by using the right syntax
4. Save the tunnel and launch it by tapping on it
5. You are now able to connect to your choosed local port

!!! tip "Port Forwarding Syntax"
    The Port Forwarding Syntax is as simple as : **LOCAL_PORT:REMOTE_SERVER:REMOTE_PORT**

### Local Port Forwarding Examples
| Forward Rule | Description |
| --- | --- |
| **8080:localhost:80** | Will forward remote port 80 (on the same server as the SSH one) to local port 8080 |
| **3389:localhost:3389** | Will forward remote port 3389 (on the same server as the SSH one) to local port 3389 |
| **2222:172.16.0.18:22** | Will forward remote port 22 (on the server 172.16.0.18) to local port 2222 |

!!! tip "Multiple forwards"
    Since WebSSH 17.3 you can add multiple forwards by either putting one forward per line or use the comma delimiter between them.

## Dynamic Port Forwarding
Dynamic Port Forwarding will forward all connections *INSIDE* WebSSH (SSH, SFTP) to a dynamic remote IP and port through your SSH server (aka **bastion**).

### How to use it?
1. Add a new tunnel by choossing **Tunnel** tab and by pessing the **+** button
2. Fill all required fields in order to establish the SSH connection
3. Finally put the magical word inside the port fowarding field, a simple wildcard character <code>*</code>
4. Save the tunnel and launch it by tapping on it
5. You are now able to launch any SSH, SFTP or even TUNNEL connection inside WebSSH through your bastion
