---
title: SSH Config File
---

# SSH Config File

!!! tip "Synced through iCloud"
    If you have enabled iCloud inside WebSSH your SSH Config File will be synced on all your devices.

!!! warning "Configuration Overwrite"
    When you define a SSH Config File inside WebSSH, it will overwrite the default configuration you have done inside each matched connections.

    For example, if you have defined a SSH Config File with a RemoteCommand but you have already defined a RemoteCommand inside a connection, the connection RemoteCommand will be overwritten by the SSH Config File RemoteCommand.

    This overwrite only happens when launching a connection. If you edit a connection, you won't see the SSH Config File values.

Since WebSSH 20.6 you can setup a SSH Config File in order to define default values for your connections.

In order to edit the WebSSH SSH Config File just need to :

1. Open WebSSH Settings (Gear)
2. Scroll to "SSH"
3.  Edit /etc/ssh/ssh_config

# Supported Features
| Keyword | Type | Expected value | Accepted Tokens |
| --- | --- | --- | --- |
| Host | String | Connection name (aka alias) pattern | None |
| HostName | String | Connection host | None |
| Port | Integer | Connection port | None |
| RemoteCommand | String | The command to launch instead of requesting a default Shell | None |
| User | String | Connection user | None |