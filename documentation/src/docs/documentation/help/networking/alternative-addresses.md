---
title: Alternative Addresses
description: "Give a saved server several addresses in WebSSH (LAN IP, VPN or overlay network address, cluster nodes) and pick the one to connect to from its context menu."
---

# Alternative Addresses[^1]
A server is not always reachable through the same address: a LAN IP at home, a ZeroTier or Tailscale address on the road, a public hostname elsewhere. A cluster may also expose one shared address plus one address per node.

Instead of duplicating the connection, you can attach **alternative addresses** to it. The main **Host** address remains the default one; an alternative address is only used when you explicitly pick it.

!!! info "WebSSH PRO"
    Alternative addresses are part of [WebSSH PRO](/documentation/pricing/).

## Add alternative addresses to a server
1. Edit your server settings
2. Press the options button at the right of the **Host** field
3. Open **Alternative Addresses**
4. Press the add button at the top right
5. Type the address (IP or hostname) and, optionally, a label such as "LAN" or "Node 2"
6. Go back and save the server settings

Drag the rows to reorder them. To remove an address, press the trash button of its row.

The options screen of the **Host** field also holds the **DNS Resolution Strategy** of the server.

## Connect through an alternative address
Open the context menu of the server and choose an entry of the **Alternative Addresses** submenu. WebSSH then connects as usual, with the same credentials and settings, but to the address you picked.

Launching the server any other way (tap, History, shortcuts) always uses the main **Host** address.

## Good to know
- The first connection to each alternative address asks you to trust the host key, exactly like a new server. Each address keeps its own host key, which is what you want for the nodes of a cluster.
- An address picked from the menu takes precedence over a `HostName` directive of your SSH config file.
- A reconnection stays on the address the session was opened with.
- Alternative addresses apply to servers (SSH, SFTP, SCP, Telnet, persistent sessions), not to tunnels.
- The list is synced with [iCloud](/documentation/help/iCloud/) like the rest of the connection.

[^1]: Available since WebSSH 33.1
