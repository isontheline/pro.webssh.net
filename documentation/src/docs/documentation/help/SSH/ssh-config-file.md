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
| Keyword | Type | Expected value | Accepted Tokens | Since |
| --- | --- | --- | --- | --- |
| Host | String | Connection name (aka alias) pattern | None | 20.6 |
| HostName | String | Connection host | None | 20.6 |
| Port | Integer | Connection port | None | 20.6 |
| RemoteCommand | String | The command to launch instead of requesting a default Shell | None | 20.6 |
| User | String | Connection user | None | 20.6 |

# Special Features 
All special features are prefixed by `#!` and are not part of the SSH Config File specification.

| Keyword | Type | Expected value | Since |
| --- | --- | --- | --- |
| #!FontSize | Integer | Font size in pixels | 21.1 |