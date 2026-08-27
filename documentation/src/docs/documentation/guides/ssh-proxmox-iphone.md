---
title: How to SSH into Proxmox from iPhone or iPad
description: Manage your Proxmox VE server from iPhone or iPad over SSH. Start VMs, enter containers, check cluster status and reach the web UI — with WebSSH.
---

# How to SSH into Proxmox from iPhone or iPad

You can manage a Proxmox VE server entirely from an iPhone or iPad over SSH: start and stop VMs with `qm`, enter LXC containers with `pct`, check cluster health, and even reach the Proxmox web UI through an SSH tunnel. WebSSH gives you a full terminal and port forwarding on iOS, so your hypervisor is never more than a pocket away.

This guide covers connecting to a Proxmox node from iOS, the commands you'll actually use, and how to reach the web interface on port 8006 without exposing it to the internet.

## What you need

- A **Proxmox VE** server (any recent version — 7.x or 8.x) reachable on your network
- Its IP address or hostname — visible on the Proxmox console banner, or in the web UI under **Datacenter → your node → System → Network**
- [WebSSH](https://apps.apple.com/app/id497714887) on your iPhone or iPad

Unlike many systems, **SSH is enabled by default on Proxmox VE** — the installer sets up `sshd` with root login allowed via password. There is nothing to activate server-side.

!!! tip "Harden root access once key auth works"
    Password login for root is convenient for the first connection, but once your key is installed (see Step 3), consider setting `PermitRootLogin prohibit-password` in `/etc/ssh/sshd_config`. Don't lock yourself out: test the key first.

## Step 1 — Add the Proxmox connection in WebSSH

1. Open **WebSSH** and tap **+** to create a new connection
2. Fill in the fields:
    - **Name:** something recognizable, e.g. `Proxmox - pve1`
    - **Host:** your node's IP or hostname (e.g. `192.168.1.10`)
    - **Port:** `22` (unless you changed it)
    - **Username:** `root`
3. Choose **Password** authentication to start
4. Tap **Save**, then tap the connection to connect

On first connection, WebSSH asks you to confirm the host key fingerprint — normal for any new server. You should land on the familiar `root@pve:~#` prompt.

!!! info "Why root?"
    Most Proxmox management commands (`qm`, `pct`, `pvecm`) require root privileges. Proxmox is designed around root access on the node shell. If you prefer a non-root user with sudo, that works with WebSSH too — configure it as you would on any Debian system.

## Step 2 — Manage VMs and containers from the terminal

Everything the web UI does for day-to-day operations has a CLI equivalent. The ones you'll use most:

**Virtual machines (`qm`):**

```bash
qm list                     # all VMs with status
qm start 100                # start VM 100
qm shutdown 100             # clean shutdown
qm stop 100                 # force stop (like pulling the plug)
qm reboot 100               # reboot
qm config 100               # show a VM's configuration
```

**LXC containers (`pct`):**

```bash
pct list                    # all containers with status
pct start 101               # start container 101
pct stop 101                # stop it
pct enter 101               # open a shell INSIDE the container
```

`pct enter` is the killer feature on mobile: one tap into your Proxmox node, one command, and you're inside any container — no per-container SSH setup needed.

**Node and cluster health:**

```bash
pveversion                  # Proxmox version
pvecm status                # cluster status and quorum
pvesm status                # storage status
journalctl -b -u pveproxy   # web UI service logs for this boot
df -h                       # disk usage
```

!!! tip "Save these as Snippets"
    WebSSH's [Snippets](/documentation/help/howtos/snippets/) let you store commands like `qm list` or `pct enter 101` and run them with one tap — no typing IDs on a phone keyboard. You can [link snippets to connections using tags](/documentation/help/howtos/link-connections-using-tags/) so your Proxmox commands only show up on your Proxmox node.

## Step 3 — Switch to SSH key authentication

For anything you connect to regularly, a key pair beats a password — faster on mobile, and far more secure.

**Generate the key in WebSSH:**

1. Go to **WebSSH Settings** (gear icon)
2. Tap **SSH Keys → +**
3. Tap **Generate** and choose **ED25519**
4. Save, then tap the key to copy the **public key**

**Authorize it on the Proxmox node** — SSH in once with your password, then:

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "PASTE_YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Finally, edit the WebSSH connection, set authentication to your new key, and reconnect. See [Create or Import a Public / Private Key Pair](/documentation/help/howtos/create-or-import-public-private-key-pair/) for details, including importing an existing key.

## Step 4 — Reach the Proxmox web UI through an SSH tunnel

The Proxmox web interface listens on **port 8006** and should never be exposed to the internet. With WebSSH's [Local Port Forwarding](/documentation/help/networking/local-port-forwarding/), you can tunnel to it securely from your iPad or iPhone:

1. In WebSSH, go to the **Tunnel** tab and tap **+**
2. Fill in the same host / credentials as your SSH connection
3. In the port forwarding field, enter:

```
8006:127.0.0.1:8006
```

4. Save and launch the tunnel
5. Open `https://127.0.0.1:8006` in Safari (accept the self-signed certificate warning) — you're on your Proxmox web UI, encrypted end-to-end through SSH

This works from anywhere your node's SSH port is reachable — and only SSH needs to be reachable.

## Even simpler — the built-in Proxmox dashboard[^1]

For day-to-day management, you don't even need the tunnel: WebSSH includes a **native Proxmox dashboard** that runs entirely over your SSH connection. Under the hood it drives `pvesh` on the node, so there is no port 8006 to expose, no API token to create, nothing to install server-side — if SSH works, the dashboard works.

**Enable it on your connection:**

1. Edit your Proxmox connection settings
2. Go to the **Roles** section
3. Enable the **PROXMOX-OVER-SSH** role (keep **SSH** enabled too if you also want the terminal)
4. Save the roles, then save the connection

From now on, tapping the connection lets you pick between the **terminal** and the **Proxmox dashboard**.

**What the dashboard gives you:**

- **Nodes overview** — every node with status, CPU, memory and disk gauges, and uptime; drill into a node or the aggregated cluster view
- **VMs and containers** — searchable, filterable lists of QEMU VMs and LXC containers with live CPU and memory usage
- **Lifecycle actions** — start, shutdown, reboot, stop, suspend and resume guests, with a confirmation before anything disruptive
- **Statistics charts** — CPU, memory, network and disk I/O history over the last hour, day, week or month, with touch scrubbing
- **Snapshots** — browse a guest's snapshot tree, create (optionally including RAM), roll back and delete
- **Backups** — launch `vzdump` backups (snapshot / suspend / stop mode, compression choice), browse archives per datastore, protect or delete them
- **Migration** — move a guest to another node, online or with restart, with optional bandwidth limit and target storage
- **Storage** — each node's datastores with usage, and their content: ISOs, container templates, backups and disk images
- **Tasks** — the same task feed as the Proxmox web UI, with live log tailing and the ability to stop a running task
- **Cluster health** — quorum, HA resources, per-node versions and pending apt updates (security updates highlighted)

The visible screen auto-refreshes every ~10 seconds, so the dashboard stays live while you watch a backup or a migration run. The full web UI (Step 4) remains the place for what the dashboard doesn't cover — creating a VM from scratch, editing the firewall, or the noVNC console.

!!! info "Free vs PRO"
    The read-only dashboard is available to everyone. Actions that change state — start/stop, snapshots, backups, migrations — require the PRO version. See [Pricing](/documentation/pricing/) for details.

!!! tip "Connect to the node, not a guest"
    The dashboard needs `pvesh`, which only exists on the Proxmox node itself. Point the connection at the hypervisor's IP — not at a VM or container — with a user allowed to run `pvesh` (root, typically).

## Troubleshooting

??? question "Connection refused on port 22"
    Rare on Proxmox since SSH is on by default. Check that you're using the node's IP (not a VM's), and that no firewall rule blocks port 22: in the web UI, **Datacenter → Firewall** and **node → Firewall**.

??? question "Permission denied (publickey) after hardening"
    You set `PermitRootLogin prohibit-password` before the key worked. Check that the public key is in `/root/.ssh/authorized_keys` with permissions `600`, and the directory `700`. If locked out, use the physical console or the web UI shell to fix it.

??? question "qm/pct: command not found"
    You're probably SSH'd into a VM or container, not the Proxmox node itself. These commands only exist on the hypervisor. Check the prompt hostname.

??? question "The web UI tunnel connects but Safari shows an error"
    Use `https://` (not `http://`) with port 8006, and accept the self-signed certificate. If the page stays blank, verify `pveproxy` is running: `systemctl status pveproxy`.

??? question "My session dies when I switch apps"
    iOS suspends backgrounded apps. For long operations (migrations, backups), run them inside [tmux](/documentation/help/howtos/tmux/create-attach-existing-tmux-session/) so they survive disconnects — reattach with `tmux attach` when you're back.

## Going further

- **Multiple nodes?** Use [tags](/documentation/help/howtos/link-connections-using-tags/) to group your cluster's connections, and [folders](/documentation/help/howtos/arrange-connections-inside-folders/) to keep the list tidy.
- **Node behind a bastion?** [Dynamic Port Forwarding](/documentation/help/networking/dynamic-port-forwarding/) turns any reachable SSH server into a jump host for your whole homelab.
- **Wake a sleeping machine:** WebSSH supports [Wake On LAN](/documentation/help/networking/wake-on-lan/) for nodes you power down between uses.
- **More homelab services:** see [Access Your Homelab Remotely via SSH Tunnel on iOS](/documentation/guides/homelab-ssh-tunnel-ios/).

## FAQ

**Can I manage Proxmox VMs from an iPhone?**
Yes. SSH into the Proxmox node with WebSSH and use `qm` (VMs) and `pct` (containers) — list, start, stop, and enter guests directly from the terminal.

**Is SSH enabled by default on Proxmox VE?**
Yes. Proxmox VE ships with SSH enabled and root password login allowed. You can connect immediately after installation with the root credentials chosen during setup.

**Can I access the Proxmox web interface from an iPad without exposing it?**
Yes. Create a WebSSH tunnel forwarding local port 8006 to `127.0.0.1:8006` on the node, then open `https://127.0.0.1:8006` in Safari. Only the SSH port needs to be reachable.

**Does WebSSH have a GUI for Proxmox?**
Yes. Enable the **PROXMOX-OVER-SSH** role on your connection and WebSSH shows a native dashboard: nodes, VMs, containers, storages, snapshots, backups, migrations, tasks and cluster health — carried entirely over SSH, with no exposed API port and no token to configure.

**Does this require a subscription?**
No. WebSSH is a one-time purchase — no subscription. The free version lets you try it with one saved connection.

---

[Download WebSSH on the App Store →](https://apps.apple.com/app/id497714887)

[^1]: The Proxmox-over-SSH dashboard is available since WebSSH 32.5.
