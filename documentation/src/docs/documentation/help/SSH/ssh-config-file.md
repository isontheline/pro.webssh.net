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
| Keyword | Type | Expected value | Since | Example usage |
| --- | --- | --- | --- | --- |
| [Ciphers](https://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5#Ciphers) | String | List of ciphers to use. Comma separated | 27.4 | [See Ciphers below](#ciphers) |
| [Host](https://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5#Host) | String | Connection name (aka alias) pattern | 20.6 | `Host MY_SERVER_NAME` |
| [HostKeyAlgorithms](https://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5#HostKeyAlgorithms) | String | List of host key algorithms to use. Comma separated | 27.4 | [See HostKeyAlgorithms below](#hostkeyalgortihms) |
| [Hostname](https://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5#Hostname) | String | Connection host | 20.6 | `Hostname my.host.com` |
| [KexAlgorithms](https://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5#KexAlgorithms) | String | List of key exchange algorithms to use. Comma separated | 27.4 | [See KexAlgorithms below](#kexalgorithms) |
| [MACs](https://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5#MACs) | String | List of MACs to use. Comma separated | 27.4 | [See MACs below](#macs)  |
| [Port](https://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5#Port) | Integer | Connection port | 20.6 | `Port 2222` |
| [RemoteCommand](https://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5#RemoteCommand) | String | The command to launch instead of requesting a default Shell | 20.6 | `RemoteCommand /bin/bash` |
| [SetEnv](https://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5#SetEnv) | String | Environment variable to set | 23.6 | `SetEnv MY_ENV="Awesome!"` |
| [User](https://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5#User) | String | Connection user | 20.6 | `User myuser` |

# Special Features 
All special features are prefixed by `#!` and are not part of the SSH Config File specification.

| Keyword | Type | Expected value | Since | Example usage |
| --- | --- | --- | --- | --- |
| #!BackgroundColor | String | Terminal background color. Any CSS value. | 22.4 | `#!BackgroundColor pink` |
| #!ColorTheme | String | Terminal color theme. Possible values : any valid theme name | 24.5 | `#!ColorTheme "GITHUB DARK"` |
| #!CursorColor | String | Terminal cursor color. Any CSS value. | 22.4 | `#!CursorColor magenta` |
| #!CursorKeysMode | String | Terminal cursor keys mode. Possible values : `normal`, `application` | 24.5 | `#!CursorKeysMode application` |
| #!FixedSize | String | Fixed terminal size (cols **x** rows) | 21.4 | `#!FixedSize 80x25` |
| #!FontSize | Integer | Font size in pixels | 21.1 | `#!FontSize 14` |
| #!ForegroundColor | String | Terminal foreground color. Any CSS value. | 22.4 | `#!ForegroundColor grey` |
| #!KeyboardAccessoryViewLayout | String | Keyboard accessory view layout. See [Keyboard Accessory View Customisation](/documentation/help/howtos/SSH/customise-keyboard-accessory-view-layout/) | 23.0 | `#!KeyboardAccessoryView {ESC}{TAB}{CTL}{FN}[/][*]{ARROWS}[|][:][-][!]{PJUMP}{INS}{PGUP}{PGDN}{HOME}{END}[$][.]` |
| #!KeyboardAccessoryViewLayoutIdiomPad | String | Same as above (overwrites) but only apply to iPad devices | 23.0 | See above |
| #!KeyboardAccessoryViewLayoutIdiomPhone | String | Same as above (overwrites) but only apply to iPhone devices | 23.0 | See above |
| #!SFTPTextEditorDefaultFileExtensions | String | Default file extensions for SFTP text editor. It will allow you to bypass the "Are you sure to edit?" dialog. Comma-separated values. | 23.0 | `#!SFTPTextEditorDefaultFileExtensions .txt,.json,.md` |
| #!RemoteCharacterSet | String | Remote character set to use. Only applicable to telnet connections. Possible values : `UTF-8`, `CP437` | 26.2 | `#!RemoteCharacterSet CP437` |
| #!TermType | String | $TERM environment variable value | 21.4 | `#!TermType xterm-256color` |

[^1]: Based on [OpenBSD ssh_config Man](https://man.openbsd.org/cgi-bin/man.cgi/OpenBSD-current/man5/ssh_config.5?query=ssh_config&sec=5)

# Advanced Details
## Ciphers
The supported ciphers are :

* chacha20-poly1305@openssh.com
* aes128-ctr
* aes256-ctr
* aes192-ctr
* aes128-cbc
* aes256-cbc
* aes192-cbc
* aes128-gcm@openssh.com
* aes256-gcm@openssh.com
* twofish256-cbc
* twofish128-cbc
* blowfish-cbc

The default enabled are :

* aes128-ctr
* aes256-ctr
* aes128-gcm@openssh.com
* aes256-gcm@openssh.com

`^` character is not supported by WebSSH. Only `+` and `-` are supported to enable or disable ciphers without changing the default ones.

## HostKeyAlgorithms
The supported host key algorithms are :

* ecdsa-sha2-nistp256
* ecdsa-sha2-nistp384
* ecdsa-sha2-nistp521
* ssh-ed25519
* rsa-sha2-256
* rsa-sha2-512
* ssh-rsa
* ssh-dss

The default enabled are :

* ssh-ed25519
* rsa-sha2-256
* rsa-sha2-512

`^` character is not supported by WebSSH. Only `+` and `-` are supported to enable or disable host key algorithms without changing the default ones.

## KexAlgorithms
The supported key exchange algorithms are :

* curve25519-sha256
* curve25519-sha256@libssh.org
* ecdh-sha2-nistp256
* ecdh-sha2-nistp384
* ecdh-sha2-nistp521
* diffie-hellman-group14-sha256
* diffie-hellman-group16-sha512
* diffie-hellman-group18-sha512
* diffie-hellman-group-exchange-sha256
* diffie-hellman-group1-sha1
* diffie-hellman-group14-sha1
* diffie-hellman-group-exchange-sha1

The default enabled are :

* curve25519-sha256
* curve25519-sha256@libssh.org
* diffie-hellman-group16-sha512
* diffie-hellman-group18-sha512
* iffie-hellman-group-exchange-sha256

`^` character is not supported by WebSSH. Only `+` and `-` are supported to enable or disable key exchange algorithms without changing the default ones.

## MACs
The supported MACs are :

* hmac-sha2-256
* hmac-sha2-512
* hmac-sha2-256-etm@openssh.com
* hmac-sha2-512-etm@openssh.com
* hmac-sha1-etm@openssh.com
* hmac-sha1
* hmac-ripemd160
* hmac-sha1-96
* hmac-md5

The default enabled are :

* hmac-sha2-256-etm@openssh.com
* hmac-sha2-512-etm@openssh.com