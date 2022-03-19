---
title: VPN-Over-SSH
---

# What is VPN-Over-SSH?
On iOS, WebSSH can use [Network Extension](https://developer.apple.com/documentation/networkextension) inside your iDevice in order to setup a [Packet Tunnel Provider](https://developer.apple.com/documentation/networkextension/packet_tunnel_provider).

VPN-Over-SSH is a great feature when you need to forward a port to another application without having WebSSH in foreground to keep the forward open. 

One drawback of VPN-Over-SSH is that only one port forwarding connection could be launched at a time.

!!! question "Why WebSSH is requesting to add VPN configuration?"
    When starting a tunnel for the first time you will encounter the following prompt :
    > "WebSSH" Would Like to Add VPN Configurations
    >
    > All network activity on this iDevice may be filtered or monitored when using VPN.

    [Packet Tunnel Provider](https://developer.apple.com/documentation/networkextension/packet_tunnel_provider) - used by WebSSH and provided by Apple - is designed to implement a packet-oriented custom VPN protocol, so it's why this prompt is displayed.
    WebSSH will never forward your data to any external foreign server. Your data will never leave your iDevice except to your own SSH server!
