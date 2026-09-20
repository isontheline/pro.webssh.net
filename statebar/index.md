# WebSSH State Bar Library

Ready-made items for the Terminal State Bar of the [WebSSH](https://webssh.net) app.
Browse them in-app: **Settings → Terminal → State Bar → [+] → WebSSH Library**.

Each collection below is a folder holding a `webssh.json` manifest and one `.js` file per item.
Want to share yours? See [CONTRIBUTING](README.md).

<!--
  Index format (parsed by the app, keep it simple):
    # Heading            → a themed section
    - [Title](folder) — subtitle `marker` `marker`
  The link is the bare name of a collection folder of this directory.
  Trailing backticked tokens are markers shown as filter chips:
  `ssh` `mosh` `http`, then the remote systems (`linux` `macos` `freebsd`…).
  Everything else (prose, comments) is ignored by the parser.
-->

# Session

- [Session](session) — Connection name, connectivity, terminal size and mosh transport, no remote command `ssh` `mosh`

# Server

- [System](system) — Load, CPU, memory, temperature, pending updates and failed services `ssh` `linux`
- [Storage](storage) — Disk usage rings, free space, inodes, ZFS and software RAID health `ssh` `linux` `freebsd`
- [Network](network) — Public IP of the server, throughput, latency and open ports `ssh` `linux`

# Containers & Virtualization

- [Docker](docker) — Running, unhealthy and restarting containers `ssh` `linux`
- [Proxmox VE](proxmox) — Running guests and cluster quorum `ssh` `linux`

# Web

- [Web APIs](web-apis) — Public IP, weather, status pages, website health, releases and prices `ssh` `mosh` `http`
- [Homelab](homelab) — Home Assistant, Uptime Kuma and Prometheus `ssh` `mosh` `http`
