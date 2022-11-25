---
title: VPN-Over-SSH
---

# VPN-Over-SSH

!!! abstract "VPN-Over-SSH Feature"
    VPN-Over-SSH is a great feature when you need to forward a port and use it in another application without having WebSSH in foreground to keep the forward open. 

!!! question "Do I need to enable this feature?"
    If you want to use the forwarded port outside WebSSH => **YES** you need

    By outside we mean using the forwarded port inside :

    * Safari / Chrome / Firefox
    * VNC / RDP
    * And all other apps you want to use with the forwarded port

!!! warning "Drawback"
    One drawback of VPN-Over-SSH is that only one port forwarding connection could be launched at a time.

!!! info "WebSSH need to add VPN configuration"
    When starting a tunnel (with VPN-Over-SSH feature enabled) for the first time you will encounter the following prompt : <code>"WebSSH" Would Like to Add VPN Configurations. All network activity on this iDevice may be filtered or monitored when using VPN.</code>

    [Packet Tunnel Provider](https://developer.apple.com/documentation/networkextension/packet_tunnel_provider) - provided by Apple - is used by WebSSH inside the VPN-Over-SSH feature and is designed to implement a packet-oriented custom VPN protocol, so it's why this prompt is displayed.
    
    WebSSH will never forward your data to any external foreign server. Your data will never leave your iDevice except to your own SSH server!
