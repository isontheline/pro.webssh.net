---
title: Dynamic Port Forwarding (DPF)
---

# Dynamic Port Forwarding (DPF)
??? abstract "About Jump Server, Bastion Host and SOCKS Proxy"
    Dynamic Port Forwarding, is a technique used to create a secure encrypted tunnel between a local device and a remote server allowing the device to securely access resources through the remote server.

    The remote server is also named a Bastion Host - or a Jump Server - which is in fact a standard SSH server that is used as an intermediary between the local device and the resources you want to access.

    When Dynamic Port Forwarding is enabled inside WebSSH, all subsequent SSH / SFTP / TUNNEL / [WEB](/documentation/web-browser/) launched connections are forwarded through the Jump Server, seemlessly.

    In background, Dynamic Port Forwarding launches a SOCKS Proxy Server on the local device, which can also be used inside a Web Browser or any other application that supports SOCKS. This way you can access any resource through the Jump Server even it's a web page, a database, a file server, etc.

??? warning "Subsequent connections are forwarded through the Jump Server"
    When enabled, Dynamic Port Forwarding will forward all connections *INSIDE* WebSSH (SSH, SFTP, TUNNEL, WEB) to your Jump Server. This means that you only will be able to access resources reachable through the Jump Server.

## How to enable Dynamic Port Forwarding?
1. Add a new tunnel by choossing **Tunnel** tab and by pessing the **+** button
2. Fill all required fields in order to establish the SSH connection
3. Finally put the magical word inside the port fowarding field : a simple wildcard character <code>*</code>
4. Save the tunnel and launch it by tapping on it
5. You are now able to launch any SSH, SFTP, TUNNEL and even [WEB](/documentation/web-browser/) connection inside WebSSH through your bastion

## And what about SOCKS Proxy Server? Aka -D
* You can use the Dynamic Port Forwarding feature to create a SOCKS Proxy Server. 
* You can use it with any application that supports SOCKS Proxy Server.
* Just configure your application to use the SOCKS Proxy Server on your iDevice and the port you have choosed in the Dynamic Port Forwarding feature.

Inside Port Forwarding field you can use the following syntax : **\*:SOCKS_PORT** where SOCKS_PORT is the port you want to listen to. 

For example : **\*:1985** will let the Proxy Server to listen on port 1985.

??? tip "Steps to enable SOCKS Proxy Server on your iDevice"
    1. Allow WebSSH to accept external connections : iOS Settings > WebSSH > Tunnel > Incoming Connections Strategy > Accept both local and remote connections
    2. (Optional) Enable VPN-Over-SSH (so you will be able to switch between apps on your iDevice)
    3. (Optional) Enable WebSSH Settings > Keep Device Awake (in order to don't sleep your device)
    4. Inside port forwarding use this : *:1985 replace 1985 by the SOCKS port you want to listen to (it will be your SOCKS server port for your other devices)
    5. Launch your tunnel
    6. (Optional) If you know your device IP address skip this step. Launch mashREPL and get your local IP address with this command : ifconfig
    7. On your other devices use a SOCKS configuration like this : 192.168.0.18:1985 where 192.168.0.18 is your iDevice and 1985 is your SOCKS server port