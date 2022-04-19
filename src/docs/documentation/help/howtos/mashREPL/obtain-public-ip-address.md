---
title: Obtain Public IP Address
---

# How to retrieve my Public IP Address?
1. Launch WebSSH
2. Start a mashREPL instance :fontawesome-solid-terminal:
3. Type one of the following commands

| Command |
| --- |
| `dig +short myip.opendns.com @resolver1.opendns.com` |
| `curl ifconfig.me` |
| `curl icanhazip.com` |
| `curl ipecho.net/plain` |
| `curl ifconfig.co` |

!!! warning "Use of VPN / Proxy"
    If you use a VPN or a Proxy (like iCloud Private Relay) you won't be able to retrieve your Public IP Address this these commands. Instead you will retrieve the Output IP Address of your VPN / Proxy.