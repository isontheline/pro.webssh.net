---
title: VPN-Over-SSH
---

# VPN-Over-SSH

VPN-Over-SSH[^1] is a great feature when you need to forward a port and use it in another application without having WebSSH in foreground to keep the forward open. 

!!! warning "Drawback"
    One drawback of VPN-Over-SSH is that only one port forwarding connection could be launched at a time.

??? question "Do I need to enable[^1] this feature?"
    If you want to use the forwarded port outside WebSSH => **YES** you need

    By outside we mean using the forwarded port inside :

    * Safari / Chrome / Firefox
    * VNC / RDP
    * And all other apps you want to use with the forwarded port

??? question "How to enable[^1] VPN-Over-SSH when I already need a VPN connection?"
    This is another drawback of VPN-Over-SSH. You can't use it if you already have a VPN connection enabled.

    You may use a competitor app - like Termius - which uses the "GPS" feature to keep the port forwarding open. WebSSH doesn't use this "hack" because it isn't good at privacy and battery health. The VPN-Over-SSH instead is using rules allowed by Apple. The GPS one isn't allowed to be used for another usage. Termius could suffer to functionality drop at any time by an upgrade to iOS. So the GPS hack shouldn't be implemented inside WebSSH. Hope that Apple will provide new ways to run some parts of apps in the background in a future iOS release.

??? question "Why WebSSH is requesting to add a VPN configuration to my device?"
    When starting a tunnel (with VPN-Over-SSH feature enabled) for the first time you will encounter the following prompt : <code>"WebSSH" Would Like to Add VPN Configurations. All network activity on this iDevice may be filtered or monitored when using VPN.</code>

    [Packet Tunnel Provider](https://developer.apple.com/documentation/networkextension/packet_tunnel_provider) - provided by Apple - is used by WebSSH inside the VPN-Over-SSH feature and is designed to implement a packet-oriented custom VPN protocol, so it's why this prompt is displayed.
    
    WebSSH will never forward your data to any external foreign server. Your data will never leave your iDevice except to your own SSH server!

[^1]: VPN-Over-SSH is NOT available on eWebSSH and WebSSH::o versions.