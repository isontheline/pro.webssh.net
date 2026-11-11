---
title: Export - From WebSSH to an ssh_config File
seo_title: "Export WebSSH Connections to an ssh_config File"
description: "Export all your WebSSH connections (host, user, port) into a single ssh_config file with the webssh export sshconfig command of mashREPL, on iPhone, iPad and Mac."
---

# Export - From WebSSH to an ssh_config File
When you need to get all your connections out of WebSSH, for example to reuse them with OpenSSH on another machine or in another SSH client, you can use the "webssh export" command line inside [mashREPL](/documentation/mashREPL/).

??? info "Since WebSSH 24"
    * This tool has been introduced in version 24 of WebSSH ([#252](https://github.com/isontheline/pro.webssh.net/issues/252)).
    * Feel free to [contact me](/support/) if you have any question or suggestion.

??? tip "The other way around"
    To load an existing `ssh_config` file into WebSSH, see [Import - From Other SSH Clients to WebSSH](/documentation/help/howtos/mashREPL/import/).

??? tip "Two formats"
    `webssh export sshconfig` writes an `ssh_config` file for OpenSSH and other SSH clients. `webssh export json` writes a [JSON connections file](#to-json-connections-file), the format WebSSH itself reads back, from a file or from a [provisioning URL](/documentation/help/howtos/provision-connections-from-url/).

## To : ssh_config
1. Launch WebSSH
2. Start a mashREPL instance :fontawesome-solid-terminal: (Tools > mashREPL)
3. Type the following command line (dry run) :
```bash
webssh export sshconfig
```

The dry run lists every connection that would be exported, and the ones that are bypassed (no host, or no user defined), without writing anything.

If you want to write the file, without any dry run, you can use the following command line :
```bash
webssh export sshconfig --apply
```

The file is written as `ssh_config` in the WebSSH documents folder (`~` inside mashREPL). You can display it, to copy it from the terminal, with :
```bash
cat ~/ssh_config
```

You can also choose the destination file :
```bash
webssh export sshconfig --apply --to-file my_config_file
```

## Where is the exported file?
The exported file is in the WebSSH documents folder :

- on iPhone / iPad, in the Files app : **On My iPhone** (or **On My iPad**) > **WebSSH** > `ssh_config`
- on the Mac, in the app container : `~/Library/Containers/com.itimeteo.webssh/Data/Documents/ssh_config` (Finder > Go > Go to Folder…)

## What is exported?
Every connection with the SSH, SFTP or SERVER role, and with both a host and a user, gives one `Host` block :

```ssh
# homelab
Host homelab
    Hostname 192.168.1.10
    User myuser
    Port 2222

# My Awesome Server
Host my.host.com
    Hostname my.host.com
    User myuser
    Port 22
```

* `Hostname`, `User` and `Port` are exported ; the connection name is kept as a comment above the block
* The `Host` alias is the connection name when it is a simple word (letters, digits, `.`, `-`, `_`), so you can type `ssh homelab` right away. A name with spaces or symbols, a name already used by a previous connection, or no name at all, gives the hostname as alias[^1]
* Passwords, private keys and passphrases are **never** exported : the file only holds how to reach your servers, not how to authenticate
* Telnet connections are not part of an `ssh_config` file and are skipped

## To : JSON connections file
Since WebSSH 33.4 ([#1128](https://github.com/isontheline/pro.webssh.net/issues/1128)) you can export your connections as a JSON connections file : the format of a [provisioning URL](/documentation/help/howtos/provision-connections-from-url/), which WebSSH can also import back on another device.

Dry run :
```bash
webssh export json
```

Write the file (`webssh-connections.json` in the WebSSH documents folder) :
```bash
webssh export json --apply
```

You can also choose the destination file :
```bash
webssh export json --apply --to-file my_connections.json
```

By default the file holds how to reach your servers (name, host, port, user, folder, tags, roles, name of the key) and never a credential. Two options change that :

| Option | Effect |
| --- | --- |
| `--with-secrets` | Adds passwords, private keys and remembered passphrases |
| `--encrypt` | Writes `webssh-connections.wsbk` instead : the same file, encrypted with your [database password](/documentation/help/howtos/automatic-database-backups/#the-database-password) |

```bash
webssh export json --apply --with-secrets --encrypt
```

??? danger "--with-secrets without --encrypt"
    The file then holds your passwords, private keys and passphrases as readable text. Store and transmit it accordingly, and never serve it as a provisioning URL. A password is never typed in the terminal, so the only encryption offered here is the database password : to protect the file with another password, use *Settings* > *Maintenance* > *Provisioning & Import / Export* > *Export*

Tunnels, and connections without a host, are not exported : the dry run lists them as bypassed.

[^1]: Before WebSSH 33.3 the alias was always the hostname, whatever the connection name.
