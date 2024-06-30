---
title: VPN-Over-SSH
---

# VPN-Over-SSH

VPN-Over-SSH[^1] is a great feature when you need to forward a port and use it on another app outside WebSSH. It's a way to use your own server as a VPN server.

!!! warning "Drawback"
    One drawback of VPN-Over-SSH is that only one TUNNEL connection could be launched at a time.

??? question "Do I need to enable[^1] this feature?"
    If you want to use the forwarded port outside WebSSH => **YES** you need

    By outside we mean using the forwarded port inside :

    * Safari / Chrome / Firefox
    * VNC / RDP
    * And all other apps you want to use with the forwarded port

??? question "How to enable VPN-Over-SSH when I already need a VPN connection?"
    This is another drawback of VPN-Over-SSH. You can't use it if you already have a VPN connection enabled. Sorry.

??? question "Why WebSSH is requesting to add a VPN configuration to my device?"
    Because VPN-Over-SSH is a VPN connection :) It's a way to use your own server as a VPN server.
    
    WebSSH will never forward your data to any external foreign server. Your data will never leave your iDevice except to your own SSH server!
