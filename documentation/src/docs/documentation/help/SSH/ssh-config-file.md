---
title: SSH Config File
---

# SSH Config File

??? tip "Synced through iCloud"
    If you have enabled iCloud inside WebSSH your SSH Config File will be synced on all your devices.

??? warning "Configuration Overwrite"
    When you define a SSH Config File inside WebSSH, it will overwrite the default configuration you have done inside each matched connections.

    For example, if you have defined a SSH Config File with a RemoteCommand but you have already defined a RemoteCommand inside a connection, the connection RemoteCommand will be overwritten by the SSH Config File RemoteCommand.

    This overwrite only happens when launching a connection. If you edit a connection, you won't see the SSH Config File values.

Since WebSSH 20.6 you can setup a SSH Config File in order to define default values for your connections.

In order to edit the WebSSH SSH Config File just need to :

1. Open WebSSH Settings :gear:
2. Scroll to "SSH" settings section
3.  Edit /etc/ssh/ssh_config

# Supported Features [^1]
| Keyword | Type | Expected value | Accepted Tokens | Since |
| --- | --- | --- | --- | --- |
| Host | String | Connection name (aka alias) pattern | None | 20.6 |
| HostName | String | Connection host | None | 20.6 |
| Port | Integer | Connection port | None | 20.6 |
| RemoteCommand | String | The command to launch instead of requesting a default Shell | None | 20.6 |
| User | String | Connection user | None | 20.6 |

# Special Features 
All special features are prefixed by `#!` and are not part of the SSH Config File specification.

| Keyword | Type | Expected value | Since | Example usage |
| --- | --- | --- | --- | --- |
| #!BackgroundColor | String | Terminal background color. Any CSS value. | 22.4 | #!BackgroundColor pink |
| #!CursorColor | String | Terminal cursor color. Any CSS value. | 22.4 | #!CursorColor magenta |
| #!FixedSize | String | Fixed terminal size (cols **x** rows) | 21.4 | #!FixedSize 80x25 |
| #!FontSize | Integer | Font size in pixels | 21.1 | #!FontSize 14 |
| #!ForegroundColor | String | Terminal foreground color. Any CSS value. | 22.4 | #!ForegroundColor grey |
| #!TermType | String | $TERM environment variable value | 21.4 | #!TermType xterm-256color |

[^1]: Based on [OpenBSD ssh_config Man](https://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5?query=ssh_config&sec=5)