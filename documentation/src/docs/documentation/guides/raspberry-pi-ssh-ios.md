---
title: How to SSH into a Raspberry Pi from iPhone or iPad
---

# How to SSH into a Raspberry Pi from iPhone or iPad

The Raspberry Pi is a staple of home labs, automation projects, and self-hosted services. WebSSH turns your iPhone or iPad into a capable terminal — so you can check logs, restart services, or run commands on your Pi without needing a laptop nearby.

This guide covers everything from enabling SSH on the Pi to connecting securely from iOS with a private key.

## Prerequisites

### Enable SSH on Your Raspberry Pi

SSH is disabled by default on recent Raspberry Pi OS images. Enable it before trying to connect.

**If you have physical access to the Pi:**

1. Open a terminal on the Pi (or connect a keyboard and monitor)
2. Run `sudo raspi-config`
3. Navigate to **Interface Options → SSH → Enable**
4. Reboot: `sudo reboot`

**Headless setup (no monitor needed):**

Before first boot, place an empty file named `ssh` (no extension) in the `/boot` partition of the SD card. The Pi will enable SSH automatically on first boot.

### Find Your Pi's IP Address

From another device on the same network, you can find the Pi's IP with:

```bash
ping raspberrypi.local
```

Or check your router's DHCP table. The Pi's hostname is `raspberrypi` by default (or whatever you set it to).

!!! tip "Set a static IP"
    For a device you'll connect to regularly, assign a static IP in your router's DHCP settings or configure a static address on the Pi itself. This way the address never changes.

## Add the Connection in WebSSH

1. Open **WebSSH** on your iPhone or iPad
2. Tap **+** to create a new connection
3. Fill in the fields:
    - **Name:** e.g. `Pi - Home Lab`
    - **Host:** your Pi's IP address or `raspberrypi.local`
    - **Port:** `22` (default)
    - **Username:** `pi` (default) or whatever user you created
4. Choose **Password** or **Private Key** for authentication
5. Tap **Save**, then tap the connection to connect

!!! warning "Change the default password"
    The default `pi` user with password `raspberry` is well known. If you haven't already, change it with `passwd` before exposing SSH to any network.

## Use Key-Based Authentication (Recommended)

A private key is both more secure and more convenient than a password. Here's how to set it up using WebSSH:

**Step 1 — Generate a key in WebSSH:**

1. Go to **Settings** (gear icon)
2. Tap **SSH Keys → + → Generate**
3. Choose **ED25519**
4. Tap the key to copy the public key

**Step 2 — Authorize the key on the Pi:**

Connect once with a password, then run:

```bash
mkdir -p ~/.ssh
echo "PASTE_YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

**Step 3 — Update your WebSSH connection:**

Edit the connection and switch authentication to your private key. You won't be asked for a password again.

## Connecting to Your Pi from Outside Your Home

By default, your Pi is only reachable from your local network. To reach it from anywhere:

**Option 1 — Port forwarding (simple, less secure):**

Forward port `22` (or a custom port) from your router to the Pi's local IP. Then connect using your public IP or a dynamic DNS hostname.

!!! warning "If you expose SSH to the internet"
    Use key-based auth only. Disable password authentication in `/etc/ssh/sshd_config` by setting `PasswordAuthentication no`.

**Option 2 — SSH tunnel through a VPS (more secure):**

If you have a cheap VPS or cloud server, you can set up a reverse tunnel so the Pi connects outward to the VPS, and you SSH into the VPS to reach the Pi. This avoids opening any ports on your home router.

**Option 3 — Tailscale or WireGuard:**

Install a VPN like Tailscale on the Pi and your iPhone. No port forwarding needed; everything is encrypted peer-to-peer.

## Multiple Terminals at Once

WebSSH lets you open multiple SSH sessions simultaneously. Useful when you need one terminal for logs and another for commands:

1. Connect to your Pi
2. Tap the terminal icon to open another session
3. See [Launching Multiple Terminals](/documentation/help/howtos/launching-multiple-terminals/) for details

## Troubleshooting

??? question "ssh: connect to host raspberrypi.local port 22: Connection refused"
    SSH is not enabled. Connect a monitor and keyboard to the Pi, run `sudo raspi-config` and enable SSH under Interface Options.

??? question "raspberrypi.local doesn't resolve"
    mDNS (Bonjour) may not be working on your network. Use the Pi's IP address directly instead. Find it in your router's DHCP table or run `hostname -I` on the Pi.

??? question "Permission denied (publickey)"
    The public key isn't correctly installed on the Pi. Check that `~/.ssh/authorized_keys` contains your key, and that permissions are `700` for `~/.ssh` and `600` for `authorized_keys`.

??? question "Connection drops when I switch apps"
    This is an iOS background execution limit. On iPad, use Split View or Slide Over to keep WebSSH visible. See [tmux](/documentation/help/howtos/tmux/create-attach-existing-tmux-session/) to keep your session alive server-side regardless of the iOS connection state.

## Related Documentation

- [SSH Public / Private Key Pair](/documentation/help/SSH/public-private-key/)
- [Local Port Forwarding](/documentation/help/networking/local-port-forwarding/) — access services running on the Pi (web UI, databases, etc.)
- [tmux — Create or Attach to an Existing Session](/documentation/help/howtos/tmux/create-attach-existing-tmux-session/)
- [Launching Multiple Terminals](/documentation/help/howtos/launching-multiple-terminals/)
