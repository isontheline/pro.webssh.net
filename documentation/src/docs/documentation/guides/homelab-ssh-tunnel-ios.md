---
title: Access Your Homelab Remotely via SSH Tunnel on iOS
---

# Access Your Homelab Remotely via SSH Tunnel on iOS

Your homelab runs services you don't want exposed to the internet — a Proxmox dashboard, a Grafana instance, a private Git server, an internal wiki. SSH tunneling lets you reach all of them securely from your iPhone or iPad, without a VPN appliance, without opening extra firewall ports, and without a subscription.

This guide shows you how to use WebSSH's port forwarding features to access homelab services from anywhere.

## How SSH Tunneling Works

An SSH tunnel creates an encrypted channel between your iOS device and a server you control (the "jump host" — typically a VPS or a machine in your homelab with SSH exposed). Once the tunnel is established, WebSSH forwards traffic through it, letting you reach internal services as if you were on your home network.

Two modes are available in WebSSH:

| Mode | Use case |
|---|---|
| **Local Port Forwarding** | Access a specific service on a specific port |
| **Dynamic Port Forwarding** | Use your server as a SOCKS proxy for multiple services at once |

## Prerequisites

You need one machine accessible from the internet over SSH. This is your entry point:

- A **VPS** (DigitalOcean, Hetzner, Linode, etc.) with SSH enabled
- Or a homelab machine with a port forwarded from your router

!!! tip "A small VPS is all you need"
    A €4/month VPS is enough to act as a jump host. All your homelab traffic goes through it encrypted — the VPS never sees the content, just the forwarded connection.

## Local Port Forwarding — Access One Service

Local Port Forwarding (LPF) maps a port on your iPhone to a port on a remote server. Once active, any connection WebSSH makes to `localhost:LOCAL_PORT` goes through the SSH tunnel to `REMOTE_HOST:REMOTE_PORT`.

**Example: access a Proxmox web UI running on `192.168.1.10:8006`**

1. Open **WebSSH** and go to the **Tunnel** tab
2. Tap **+** to create a new tunnel
3. Fill in the SSH connection details for your jump host
4. In the **Port Forwarding** field, enter:
   ```
   8006:192.168.1.10:8006
   ```
5. Save the tunnel and tap it to start it
6. Open WebSSH's built-in browser and navigate to `https://localhost:8006`

!!! tip "Port Forwarding syntax"
    The format is `LOCAL_PORT:REMOTE_HOST:REMOTE_PORT`. The remote host is resolved from the perspective of the SSH server — so `localhost` means the SSH server itself, and `192.168.1.10` means a machine on the same LAN as the SSH server.

**More examples:**

| Forward Rule | What it does |
|---|---|
| `3000:localhost:3000` | Grafana on the jump host itself |
| `8080:192.168.1.50:80` | Web UI on a NAS at 192.168.1.50 |
| `5432:192.168.1.20:5432` | PostgreSQL on an internal server |

See [Local Port Forwarding](/documentation/help/networking/local-port-forwarding/) for the full documentation.

## Dynamic Port Forwarding — Access Everything at Once

Dynamic Port Forwarding (DPF) turns your jump host into a SOCKS proxy. All connections made within WebSSH are routed through it — useful when you need to reach multiple internal services without creating one tunnel per service.

1. Go to the **Tunnel** tab in WebSSH
2. Tap **+** to create a new tunnel
3. Fill in the SSH connection details for your jump host
4. In the **Port Forwarding** field, enter `*` (an asterisk)
5. Save and start the tunnel
6. Now open any SSH or SFTP connection inside WebSSH — it will go through the tunnel and can reach internal addresses

!!! warning "DPF only routes WebSSH traffic"
    Dynamic Port Forwarding routes connections made within WebSSH only. Other apps on your iPhone (Safari, etc.) are not affected. 

See [Dynamic Port Forwarding](/documentation/help/networking/dynamic-port-forwarding/) for the full documentation.

## Securing Your Jump Host

If your jump host is exposed to the internet, take a few minutes to harden it:

- **Use key-based SSH authentication** — disable password login in `/etc/ssh/sshd_config` with `PasswordAuthentication no`
- **Use a non-standard SSH port** — reduces automated scan noise
- **Set up fail2ban** — automatically bans IPs with repeated failed login attempts
- **Keep the system updated** — `apt update && apt upgrade` regularly

See [SSH Public / Private Key Pair](/documentation/help/SSH/public-private-key/) for setting up key auth with WebSSH.

## Troubleshooting

??? question "Tunnel connects but I can't reach the internal service"
    Check that the port forwarding rule uses the correct remote address. The remote host is resolved from the SSH server's perspective. If the service is on the same machine as the SSH server, use `localhost`. If it's on another machine, use its LAN IP.

??? question "Connection refused on the local port"
    The tunnel must be running (green/active) before you try to connect. Tap the tunnel to start it, then make your connection.

??? question "Tunnel drops after a few minutes of inactivity"
    SSH connections can time out. Configure `ServerAliveInterval` in your ssh_config file on the server side, or use tmux on the jump host to keep sessions alive.

??? question "I need to access multiple homelab machines"
    Use Dynamic Port Forwarding (`*`) — this creates a SOCKS proxy so WebSSH can route to any internal address through a single tunnel. Alternatively, set up multiple Local Port Forwarding rules separated by commas (e.g. `8006:192.168.1.10:8006,3000:192.168.1.20:3000`).

## Related Documentation

- [Port Forwarding overview](/documentation/help/networking/port-forwarding/)
- [Local Port Forwarding](/documentation/help/networking/local-port-forwarding/)
- [Dynamic Port Forwarding](/documentation/help/networking/dynamic-port-forwarding/)
- [VPN-Over-SSH](/documentation/help/networking/vpn-over-ssh/)
- [Port Knocking](/documentation/help/networking/port-knocking/) — hide your SSH port until you knock
