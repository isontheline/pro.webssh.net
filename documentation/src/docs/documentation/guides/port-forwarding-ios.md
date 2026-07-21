---
title: SSH Port Forwarding on iOS — Tunnels on iPhone & iPad
description: Set up SSH port forwarding on iOS with WebSSH. Local forwarding, SOCKS proxy, multiple forwards, tunnels in Safari — exact syntax and examples.
---

# SSH Port Forwarding on iOS

SSH port forwarding works fully on iOS: with WebSSH you can forward a local port to any service reachable from your server, or run a SOCKS proxy on your iPhone or iPad — the same `-L` and `-D` tunnels you'd create with OpenSSH on a desktop. No jailbreak, no VPN appliance, no subscription.

This guide explains the two forwarding modes, the exact syntax WebSSH uses, and worked examples — including how to use a forwarded port in Safari or any other app on your device.

## What you need

- Any SSH server you can log into (a VPS, a homelab machine, a NAS…)
- [WebSSH](https://apps.apple.com/app/id497714887) on your iPhone or iPad
- The address and port of the service you want to reach *from that server's point of view*

## The two forwarding modes

| Mode | OpenSSH equivalent | Use case |
| --- | --- | --- |
| [Local Port Forwarding (LPF)](/documentation/help/networking/local-port-forwarding/) | `ssh -L` | Reach one specific service on a specific port |
| [Dynamic Port Forwarding (DPF)](/documentation/help/networking/dynamic-port-forwarding/) | `ssh -D` | SOCKS proxy — reach many services through one jump host |

Both live in WebSSH's **Tunnel** tab, and both keep every byte encrypted between your device and your server.

## Step 1 — Create a tunnel

1. Open **WebSSH**, go to the **Tunnel** tab and tap **+**
2. Fill in the SSH connection fields (host, port, username, key or password) — exactly as for a terminal connection
3. Enter a forwarding rule in the **Port Forwarding** field (syntax below)
4. Save, then tap the tunnel to launch it

## Step 2 — Local forwarding syntax

The rule format is:

```
LOCAL_PORT:REMOTE_HOST:REMOTE_PORT
```

`REMOTE_HOST` is resolved **from the SSH server**, not from your device. That's what makes tunnels powerful: anything your server can reach, your iPhone can reach.

| Rule | What it does |
| --- | --- |
| `8080:localhost:80` | Web server running on the SSH server itself → `http://127.0.0.1:8080` on your device |
| `8006:127.0.0.1:8006` | Proxmox web UI on the node → `https://127.0.0.1:8006` |
| `5432:10.0.0.5:5432` | PostgreSQL on another machine of the server's network |
| `3389:192.168.1.20:3389` | RDP to a Windows machine behind the SSH server |

**Multiple forwards** in one tunnel: put one rule per line, or separate them with commas (WebSSH 17.3+):

```
8080:localhost:80
9090:localhost:9090
5432:10.0.0.5:5432
```

## Step 3 — Dynamic forwarding (SOCKS proxy)

When you need many services rather than one port, use [Dynamic Port Forwarding](/documentation/help/networking/dynamic-port-forwarding/). In the Port Forwarding field, enter a single wildcard:

```
*
```

Once launched, **all subsequent WebSSH connections** (SSH, SFTP, TUNNEL, [WEB](/documentation/web-browser/)) are transparently routed through this server — it becomes your jump host / bastion.

To also expose the SOCKS proxy on a chosen port (usable by other devices or apps):

```
*:1985
```

## Step 4 — Use the tunnel outside WebSSH

By default, a forwarded port is usable inside WebSSH. To use it in **Safari, VNC, RDP or any other app** on your device, enable [VPN-Over-SSH](/documentation/help/networking/vpn-over-ssh/):

1. Enable VPN-Over-SSH in WebSSH's settings — iOS will ask to add a VPN configuration (your data only ever goes to *your own* server)
2. Launch your tunnel
3. Open `http://127.0.0.1:LOCAL_PORT` in Safari, or point your app at the forwarded port

!!! warning "One tunnel at a time with VPN-Over-SSH"
    VPN-Over-SSH allows a single TUNNEL connection at a time, and can't run alongside another VPN (WireGuard, Tailscale…). Disable the other VPN first.

## Troubleshooting

??? question "Connection refused on the local port"
    The tunnel isn't running, or the local port in your rule doesn't match the one you're opening. Ports below 1024 can't be bound on iOS — use high ports (8080, not 80) on the local side.

??? question "The tunnel launches but the service doesn't answer"
    The remote side is wrong. Remember `REMOTE_HOST:REMOTE_PORT` is evaluated **from the server**. SSH into the server and test with `curl http://REMOTE_HOST:REMOTE_PORT` to confirm the service is reachable from there.

??? question "Works in WebSSH but not in Safari"
    You need [VPN-Over-SSH](/documentation/help/networking/vpn-over-ssh/) enabled for the port to be visible to other apps. Also check that another VPN isn't active.

??? question "The tunnel drops when I switch apps"
    iOS suspends backgrounded apps. Keep WebSSH in Split View / Slide Over on iPad, or re-launch the tunnel when returning to it. Enabling VPN-Over-SSH also helps keep the tunnel alive while you use other apps.

??? question "I need to reach a server that's not directly exposed"
    Chain through a bastion: launch a Dynamic Port Forwarding tunnel (`*`) to the reachable host first, then connect to the internal one — WebSSH routes it through the jump host automatically.

## Going further

- **Real-world walkthrough:** [Access Your Homelab Remotely via SSH Tunnel on iOS](/documentation/guides/homelab-ssh-tunnel-ios/) applies these tunnels to Proxmox, Grafana and self-hosted services.
- **Proxmox specifically:** [How to SSH into Proxmox from iPhone or iPad](/documentation/guides/ssh-proxmox-iphone/) includes tunneling to the web UI on port 8006.
- **Key-based auth for your tunnels:** [Create or Import a Public / Private Key Pair](/documentation/help/howtos/create-or-import-public-private-key-pair/).
- **Reference pages:** [Port Forwarding](/documentation/help/networking/port-forwarding/), [Local Port Forwarding](/documentation/help/networking/local-port-forwarding/), [Dynamic Port Forwarding](/documentation/help/networking/dynamic-port-forwarding/).

## FAQ

**Can you do SSH port forwarding on an iPhone?**
Yes. WebSSH supports local port forwarding (`ssh -L` equivalent) and dynamic port forwarding / SOCKS proxy (`ssh -D` equivalent) on iPhone and iPad, without a jailbreak.

**Can I use an SSH tunnel with Safari on iOS?**
Yes. Enable WebSSH's VPN-Over-SSH feature, launch your tunnel, and open the forwarded local port in Safari. Traffic goes only to your own SSH server.

**Can I forward multiple ports in one tunnel?**
Yes. Since WebSSH 17.3 you can list several rules in one tunnel — one per line or comma-separated.

**Is remote port forwarding (`ssh -R`) supported?**
No. WebSSH's Tunnel feature covers local and dynamic forwarding.

---

[Download WebSSH on the App Store →](https://apps.apple.com/app/id497714887)
