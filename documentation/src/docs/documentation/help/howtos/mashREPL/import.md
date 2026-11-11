---
title: Import - From Other SSH Clients to WebSSH
seo_title: "Import Connections from Other SSH Clients to WebSSH"
---

# Import - From Other SSH Clients to WebSSH
When you need to import connections into WebSSH, you can use the "webssh import" command line inside mashREPL.

??? tip "The other way around"
    To write all your WebSSH connections into a single `ssh_config` file, see [Export - From WebSSH to an ssh_config File](/documentation/help/howtos/mashREPL/export/).

??? bug "Relatively Young Tool"
    * This tool has been introduced in version 24 of WebSSH in order to help users to import their connections from other SSH clients.
    * This tool is relatively young and will be improved over time. Feel free to [contact me](/support/) if you have any question or suggestion.

??? danger "Backup Your Data"
    * This tool is a powerful tool that can alter your data if you don't use it carefully or if a bug occurs (more likely)
    * It is strongly advised to [backup your data](/documentation/help/howtos/mashREPL/database-backup/) before using this tool.

## From : ssh_config
When you use ssh_config inside WebSSH no connection is imported because by default this configuration file is only used to overwrite the default connection settings : [learn more](/documentation/help/SSH/ssh-config-file/)

In some cases, you may want to import your ssh_config aliases into WebSSH. To do so, you can use the following command line (dry run) :
```bash
webssh import sshconfig
```

If you want to import them, without any dry run, you can use the following command line :
```bash
webssh import sshconfig --apply
```

If you want to overwrite already existing connections (by alias name), you can use the following command line :
```bash
webssh import sshconfig --apply --overwrite
```

You can also specify a custom ssh_config filepath (since WebSSH 24.3) :
```bash
webssh import sshconfig --from-file my_config_file
```

## From : JSON connections file
Since WebSSH 33.4 ([#1128](https://github.com/isontheline/pro.webssh.net/issues/1128)) you can import a JSON connections file : a file written by [`webssh export json`](/documentation/help/howtos/mashREPL/export/#to-json-connections-file) or by *Settings* > *Maintenance* > *Provisioning*, or one you wrote yourself in the [same format](/documentation/help/howtos/provision-connections-from-url/#the-connections-file).

Dry run, which lists what would be created, updated and skipped :
```bash
webssh import json webssh-connections.json
```

Import, without any dry run :
```bash
webssh import json webssh-connections.json --apply
```

Connections that already exist are skipped. To update them :
```bash
webssh import json webssh-connections.json --apply --overwrite
```

* A connection is recognized by the `id` of its entry, then by its name
* A file holding passwords and private keys imports them with the connections ; a key already on the device is reused, not duplicated
* An encrypted file (`.wsbk`) opens by itself when it was encrypted with the database password of this device. A password is never typed in the terminal : a file protected by another password is imported from *Settings* > *Maintenance* > *Provisioning* > *Import connections…*
* Like `webssh import sshconfig`, applying the import requires [WebSSH PRO](/documentation/pricing/)

??? tip "Keep devices up to date"
    To have WebSSH read the file again at each launch instead of importing it once, host it and use a [provisioning URL](/documentation/help/howtos/provision-connections-from-url/).
