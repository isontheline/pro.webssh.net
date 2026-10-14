---
title: Obtain Public IP Address
---

# How to retrieve my Public IP Address?
1. Launch WebSSH
2. Start a mashREPL instance :fontawesome-solid-terminal:
3. Type one of the following commands

| Command | Comment |
| --- | --- |
| `dig +short myip.opendns.com @resolver1.opendns.com` | IPv4 or IPv6, whichever your device uses to reach the resolver |
| `dig -4 +short myip.opendns.com @resolver1.opendns.com` | Force IPv4 |
| `dig -6 +short AAAA myip.opendns.com @resolver1.opendns.com` | Force IPv6 |
| `dig +short TXT o-o.myaddr.l.google.com @ns1.google.com` | Google's resolver, answer between quotes |
| `host myip.opendns.com resolver1.opendns.com` | Same lookup, verbose output |

!!! note "Prefer an HTTP service?"
    The `curl` command left mashREPL in WebSSH 33.2. Open the [HTTP Forge](/documentation/tools/#http-forge) tool and send a GET request to `https://ifconfig.me` or `https://icanhazip.com` instead.

!!! warning "Use of VPN / Proxy"
    If you use a VPN or a Proxy (like iCloud Private Relay) you won't be able to retrieve your Public IP Address this these commands. Instead you will retrieve the Output IP Address of your VPN / Proxy.