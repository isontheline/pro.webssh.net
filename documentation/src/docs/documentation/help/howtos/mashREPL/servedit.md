---
title: Servedit - Update Connections in Batch
---

# Servedit - Update Connections in Batch
When you need to update your connections settings in batch, you can use the "webssh servedit" command line inside mashREPL. 

??? bug "Relatively Young Tool"
    * This tool has been introduced in version 24 of WebSSH in order to help users to update their connections duplicated by the [Unified server list for SSH and SFTP](https://github.com/isontheline/pro.webssh.net/issues/202) feature.
    * This tool is relatively young and will be improved over time. Feel free to [contact me](/support/) if you have any question or suggestion.

??? danger "Backup Your Data"
    * This tool is a powerful tool that can alter your data if you don't use it carefully or if a bug occurs (more likely)
    * It is strongly advised to [backup your data](/documentation/help/howtos/mashREPL/database-backup/) before using this tool.

## Usage
```bash
webssh servedit --help
webssh servedit update --help
webssh servedit delete --help
```

## Examples Update Connections
Update all connections with the only role "SSH" to have the both roles "SSH" and "SFTP" :
```bash
webssh servedit update --set-role="SSH" --set-role="SFTP" --where-roles="^SSH$"
```

Update connections with name containing "myserver" to have only the role "SSH" :
```bash
webssh servedit update --set-role="SSH" --where-name="myserver"
```

Update connections with name starting with "Awesome" to have the both roles "SSH" and "SFTP" :
```bash
webssh servedit update --set-role="SSH" --set-role="SFTP" --where-name="^Awesome"
```

## Examples Delete Connections
Delete all connections with the only role "SFTP" (useful after the [Unified server list for SSH and SFTP](https://github.com/isontheline/pro.webssh.net/issues/202) update) :
```bash
webssh servedit delete --where-roles="^SFTP$"
```