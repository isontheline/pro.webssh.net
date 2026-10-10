---
title: Automatic Database Backups
seo_title: "Automatic Backups of Your WebSSH Connections, Keys and Snippets - WebSSH"
description: "WebSSH backs up its database (connections, keys, snippets, settings) once a day on its own. Where the backups are, how long they are kept, how to restore one, and why they must be kept private."
---

# Automatic Database Backups[^1]
Everything you set up in WebSSH lives in one database: connections, private keys, snippets, settings, State Bar items. Since WebSSH 32.2 that database is backed up automatically, so a bad restore, a deleted connection or a sync gone wrong can be undone without a Mac and without a restore from a device backup.

Automatic backups are enabled by default, on iPhone, iPad and Mac, in the FREE and PRO versions alike.

## When a backup is made
WebSSH checks at launch, when it comes back to the foreground and once an hour while it stays open. When the last backup is **24 hours** old or more, a new one is written. One backup a day, no more, whatever you do with the app in between.

An automatic backup is taken after the app has migrated its database to a new version, not before.

## Where to find them
Open **Settings ▸ Maintenance ▸ Database Backup**. The screen lists the backups, newest first, with their date, time and size, and holds the **Automatic backups** switch.

The files are regular files in the **backups** folder of WebSSH, the same folder used by the mashREPL command below:

- on iPhone and iPad, in the **Files** app, under *On My iPhone* (or *On My iPad*) ▸ **WebSSH** ▸ **backups**
- on the Mac, in the app container: `~/Library/Containers/com.itimeteo.webssh/Data/Documents/backups`

Each file is named after its creation time, `20260612_221406_webssh.db` for a backup made on June 12, 2026 at 22:14:06. Copy a file from there to keep it somewhere else, or to move your setup to another device.

Backups are **not** synced through iCloud. [iCloud Sync](/documentation/help/iCloud/) keeps the records of your devices in step; it is not a backup, which is exactly what these files are for.

## How long they are kept
WebSSH thins the folder out each time it writes a backup:

- every backup of the **last 7 days** is kept,
- one per week is kept for the **3 weeks** before that,
- one per month is kept for the **year** before that,
- older files are deleted.

A year of history is about twenty small files. There is no size cap. Backups made by hand with mashREPL live in the same folder and follow the same rotation.

## Back up now, restore, delete
- **Backup Now**, at the top right of the screen, writes a backup immediately, even when automatic backups are off.
- **Restore**: long press a backup (right click on the Mac) and choose **Restore**. The backup **replaces** the current database; nothing is merged. Quit and relaunch WebSSH afterwards for the restored data to load.
- **Delete**: same menu. Deleting a backup cannot be undone.

??? warning "Restore and iCloud"
    If iCloud Sync is enabled, disable it and enable it again after a restore, so that the restored data is pushed to your other devices. Connections that exist on iCloud and not in the backup are merged back, not deleted.

??? tip "Take a backup before a risky change"
    Before cleaning up dozens of connections, importing keys or restoring something else, tap **Backup Now**. The file waits in the list for a week at least.

## Turning it off
Switch **Automatic backups** off on the same screen. The existing files are left in place and are no longer rotated; **Backup Now** still works.

## From mashREPL
The [mashREPL](/documentation/mashREPL/) commands predate the automatic backups and use the same folder and format:

```
webssh database backup
webssh database restore 20260612_221406_webssh.db
```

See [Database Backup](mashREPL/database-backup.md) and [Database Restore](mashREPL/database-restore.md).

[^1]: Available since WebSSH 32.2
