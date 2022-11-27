---
title: SSH Config File
---

!!! tip "Synced through iCloud"
    If you have enabled iCloud inside WebSSH your SSH Config File will be synced on all your devices.

Since WebSSH 20.6 you can setup a SSH Config File in order to define default values for your connections.

In order to edit the WebSSH SSH Config File just need to :

1. Open WebSSH Settings (Gear)
2. Scroll to "SSH"
3.  Edit .ssh/config

# Supported Features
| Keyword | Type | Expected value |
| --- | --- | --- |
| Host | String | Connection name (aka alias) |
| HostName | String | Connection host |
| Port | Integer | Connection port |
| RemoteCommand | String | The command to launch instead of requesting a default Shell |
| User | String | Connection user |