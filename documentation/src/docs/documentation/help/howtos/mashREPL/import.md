---
title: Import - From Other SSH Clients to WebSSH
---

# Import - From Other SSH Clients to WebSSH
When you need to import connections into WebSSH, you can use the "webssh import" command line inside mashREPL.

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