---
title: Database Backup
---

# How to make a backup of the WebSSH database?
1. Launch WebSSH
2. Start a mashREPL instance :fontawesome-solid-terminal:
3. Type the following command[^1] : webssh database backup

Now you will have a database backup located in the "backups" directory of WebSSH.

Since WebSSH 33.4 the backup is a `.wsbk` file, **encrypted** with the database password of the device. That password is shown in **Settings ▸ Maintenance ▸ Local Database**; you need it to restore the backup on another device. See [Automatic Database Backups](/documentation/help/howtos/automatic-database-backups/#the-database-password).

??? info "Automatic backups"
    Since WebSSH 32.2 the database is backed up once a day on its own, in the same folder. See [Automatic Database Backups](/documentation/help/howtos/automatic-database-backups/) to list, restore or delete them from the Settings.

[^1]: In order to use this functionality, you must upgrade WebSSH to 14.15