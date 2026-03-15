---
title: SSH to Synology NAS from iPhone or iPad
---

# SSH to Synology NAS from iPhone or iPad

Managing a Synology NAS remotely used to mean sitting at a desktop. With WebSSH on iOS and iPadOS, you can open a full SSH terminal to your NAS from anywhere — your iPhone on the couch, your iPad at a coffee shop, your phone on call when something breaks at 2 AM.

This guide walks you through everything: enabling SSH on your Synology, adding the connection in WebSSH, and connecting securely with a private key.

## Prerequisites

### Enable SSH on your Synology NAS

1. Open **DSM** (DiskStation Manager) in a browser
2. Go to **Control Panel → Terminal & SNMP**
3. Check **Enable SSH service**
4. Set a port (default is `22`; using a non-standard port like `2222` reduces automated brute-force attempts)
5. Click **Apply**

!!! tip "Use a non-standard SSH port"
    Changing the port from `22` to something like `2222` or `22022` significantly reduces noise from automated bots. WebSSH lets you set any port per connection.

### Know your NAS address

- **On your local network:** find the NAS IP in **Control Panel → Network → Network Interface** (e.g. `192.168.1.100`)
- **From outside your home:** you need either a static public IP, a DDNS hostname (Synology provides one free at `yourname.synology.me`), or a [VPN-Over-SSH](/documentation/help/networking/vpn-over-ssh/) setup

## Add the Connection in WebSSH

1. Open **WebSSH** on your iPhone or iPad
2. Tap the **+** button to create a new connection
3. Fill in the fields:
    - **Name:** anything recognizable, e.g. `NAS - Home`
    - **Host:** your NAS IP or DDNS hostname
    - **Port:** the SSH port you configured in DSM
    - **Username:** your DSM admin account (or a dedicated user — see tip below)
4. Choose your authentication method:
    - **Password:** simplest to start with
    - **Private Key:** recommended for regular use (see below)
5. Tap **Save**
6. Tap the connection to connect

!!! warning "Use a dedicated user, not admin"
    For day-to-day SSH access, create a dedicated DSM user with limited permissions. Only use the `admin` account when you actually need it.

## Authenticate with a Private Key (Recommended)

Password authentication works, but a key pair is more secure and more convenient — no password to type each time.

**Generate the key pair in WebSSH:**

1. Go to **WebSSH Settings** (gear icon)
2. Tap **SSH Keys → +**
3. Tap **Generate**, choose **ED25519** (fastest and most secure)
4. Save the key, then tap it to copy the **public key**

**Authorize the key on your Synology:**

1. SSH in once with your password
2. Run:
```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "PASTE_YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```
3. Edit your connection in WebSSH and switch the authentication to **Private Key**

From now on, WebSSH connects without prompting for a password.

!!! tip "Want a more visual way to copy the key?"
    See [Create or Import a Public/Private Key Pair](/documentation/help/howtos/create-or-import-public-private-key-pair/) for the full walkthrough.

## Connecting from Outside Your Home Network

If you want to reach your NAS when you're not on your home Wi-Fi:

- **Synology DDNS:** enable it in **Control Panel → External Access → DDNS** — you'll get a free `yourname.synology.me` hostname
- **Port forwarding:** on your router, forward the SSH port to your NAS local IP
- **SSH Tunnel:** if you don't want to expose SSH directly to the internet, set up a jump host and use [Local Port Forwarding](/documentation/help/networking/local-port-forwarding/) in WebSSH

!!! warning "Exposing SSH to the internet"
    If you open an SSH port to the internet, use key-based authentication and disable password login in DSM. Check **Control Panel → Terminal & SNMP** and ensure only key auth is accepted.

## Troubleshooting

??? question "Connection refused or timeout"
    - Confirm SSH is enabled in DSM
    - Check the port number matches what you configured
    - If connecting from outside, verify your router's port forwarding rules
    - Try pinging the NAS first using WebSSH's built-in **Ping** tool

??? question "Authentication failed"
    - Double-check your DSM username (it's case-sensitive)
    - If using a private key, make sure the public key was correctly appended to `~/.ssh/authorized_keys` on the NAS
    - Use [Verbose Logging](/documentation/help/howtos/enabling-verbose-logging/) in WebSSH to see the exact error

??? question "Disconnects after a short time"
    iOS suspends background apps aggressively. On iPad, use **Split View** to keep WebSSH in the foreground. See the FAQ entry on [preventing disconnections](/documentation/frequently-asked-questions/#how-can-i-prevent-webssh-disconnecting-when-switching-apps-on-ipad-or-iphone) for more options.

## Related Documentation

- [Local Port Forwarding](/documentation/help/networking/local-port-forwarding/)
- [VPN-Over-SSH](/documentation/help/networking/vpn-over-ssh/)
- [Public / Private Key Pair](/documentation/help/SSH/public-private-key/)
- [iCloud Sync](/documentation/help/iCloud/) — sync your NAS connection across all your Apple devices
