# mashREPL
!!! info "What's mashREPL?"
    It's a small **R**ead **E**val **P**rint **L**oop that allow you to run *local* commands inside your iOS and iPadOS device!

## Available commands
| Command    | Since | Comments |
| --- | --- | --- |
| `awk`      | 14.6 | Standard input supported on WebSSH >= 33.2 |
| `cat`      | 14.6 | Standard input supported on WebSSH >= 33.2 |
| `cd`       | 14.6 | |
| `cksum`    | 33.2 | POSIX checksum |
| `compress` | 33.2 |  |
| `cp`       | 14.6 | |
| `curl`     | 14.17 | Removed in 33.2 to keep the app small. Use the [HTTP Forge](/documentation/tools/#http-forge) tool for HTTP requests |
| `date`     | 14.6 | |
| `diff`     | 33.2 |  |
| `dig`      | 14.6 | |
| `du`       | 14.6 | |
| `echo`     | 14.6 | |
| `egrep`    | 33.2 | alias of `grep -E` |
| `env`      | 14.6 | |
| `fgrep`    | 33.2 | alias of `grep -F` |
| `find`     | 14.6 | |
| `gunzip`   | 33.2 |  |
| `gzip`     | 33.2 |  |
| `head`     | 14.6 | |
| `host`     | 14.6 | |
| `ifconfig` | 14.6 | |
| `ls`       | 14.6 | |
| `malte`    | 21.0 | Little Text Editor with a GUI |
| `mans`     | 23.2 | Network Scanner "like" nmap |
| `md5`      | 33.2 |  |
| `mkdir`    | 14.6 | |
| `mv`       | 14.6 | |
| `nc`       | 33.2 | netcat |
| `nslookup` | 14.6 | Standard input supported on WebSSH >= 33.2 |
| `open`     | 14.6 | |
| `openurl`  | 14.6 | |
| `ping`     | 14.6 | |
| `ping6`    | 33.2 | IPv6 ping |
| `printenv` | 14.6 | |
| `pwd`      | 14.6 | |
| `rm`       | 14.6 | |
| `sed`      | 14.6 | Standard input supported on WebSSH >= 33.2 |
| `setenv`   | 14.6 | |
| `sort`     | 14.6 | Standard input supported on WebSSH >= 33.2 |
| `stat`     | 14.6 | |
| `sum`      | 33.2 | BSD checksum |
| `tail`     | 14.6 | Standard input supported on WebSSH >= 33.2 |
| `tar`      | 14.6 | |
| `tee`      | 33.2 |  |
| `touch`    | 14.6 | |
| `tr`       | 33.2 |  |
| `uname`    | 14.6 | |
| `uncompress` | 33.2 |  |
| `uniq`     | 33.2 |  |
| `unsetenv` | 14.6 | |
| `uptime`   | 14.6 | |
| `wc`       | 14.6 | Standard input supported on WebSSH >= 33.2 |
| `webssh`   | 14.6 | Manages WebSSH itself, see [below](#the-webssh-command) |
| `whoami`   | 14.6 | |
| `whois`    | 14.6 | |
| `xargs`    | 33.2 |  |

## The `webssh` command
`webssh` manages the app itself from mashREPL. Type `webssh` alone to list its commands, and `webssh <command> --help` for the options of a command.

| Command | What it does |
| --- | --- |
| `webssh database backup` | [Backs up the database](/documentation/help/howtos/mashREPL/database-backup/) in `~/backups` |
| `webssh database restore <webssh.db>` | [Restores a database backup](/documentation/help/howtos/mashREPL/database-restore/) |
| `webssh database compact` / `vacuum` / `locate` | Maintenance of the database file |
| `webssh export sshconfig [--apply] [--to-file <path>]` | [Exports all your connections](/documentation/help/howtos/mashREPL/export/) into one `ssh_config` file. Dry run without `--apply` |
| `webssh fingerprint clean <host>` / `all` | Forgets the host key fingerprints you have accepted |
| `webssh import sshconfig [--apply] [--overwrite] [--from-file <path>]` | [Imports `ssh_config` aliases](/documentation/help/howtos/mashREPL/import/) as connections. Dry run without `--apply` |
| `webssh servedit update` / `delete` | [Updates or deletes connections in batch](/documentation/help/howtos/mashREPL/servedit/) |
| `webssh store sync` / `unregister all` | Refreshes your purchases with the App Store |
| `webssh version [build, full]` | Prints the WebSSH version |
