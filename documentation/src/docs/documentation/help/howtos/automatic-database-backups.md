---
title: Automatic Database Backups
seo_title: "Automatic Backups of Your WebSSH Connections, Keys and Snippets - WebSSH"
description: "WebSSH backs up its database (connections, keys, snippets, settings) once a day on its own, encrypted with a password. Where the backups are, how long they are kept, how to restore or export one, and how the database password works."
---

# Automatic Database Backups[^1]
Everything you set up in WebSSH lives in one database: connections, private keys, snippets, settings, State Bar items. Since WebSSH 32.2 that database is backed up automatically, so a bad restore, a deleted connection or a sync gone wrong can be undone without a Mac and without a restore from a device backup.

Automatic backups are enabled by default, on iPhone, iPad and Mac, in the FREE and PRO versions alike.

Since WebSSH 33.4 every backup is **encrypted with a password**[^2]. A backup holds your connections and may hold passwords and private keys: a copy that leaves your device can no longer be read without the [database password](#the-database-password).

## When a backup is made
WebSSH checks at launch, when it comes back to the foreground and once an hour while it stays open. When the last backup is **24 hours** old or more, a new one is written. One backup a day, no more, whatever you do with the app in between.

An automatic backup is taken after the app has migrated its database to a new version, not before.

Before each backup WebSSH checks that the database is sound. A database that fails this check is **not backed up**, so that a damaged copy never takes the place of a good one; the **Local Database** screen then says so. Restoring a backup repairs it.

### When a backup fails
If a backup cannot be written (the database failed its check, the disk is full…), a **red dot** appears on the settings gear, on **Maintenance** and on **Local Database**, and the screen says what went wrong. While it lasts, WebSSH **stops deleting older backups**: the copies you have are kept as they are. The dot goes away by itself at the next backup that succeeds, or after a restore.

## Where to find them
Open **Settings ▸ Maintenance ▸ Local Database**. The screen lists the backups, newest first, with their date, time and size, under the **Automatic backups** switch, and starts with the **Database Password** section. A closed padlock marks an encrypted backup, an open one a backup made before WebSSH 33.4.

The files are regular files in the **backups** folder of WebSSH, the same folder used by the mashREPL command below:

- on iPhone and iPad, in the **Files** app, under *On My iPhone* (or *On My iPad*) ▸ **WebSSH** ▸ **backups**
- on the Mac, in the app container: `~/Library/Containers/com.itimeteo.webssh/Data/Documents/backups`

Each file is named after its creation time, `20261112_221406_webssh.wsbk` for a backup made on November 12, 2026 at 22:14:06. Copy a file from there to keep it somewhere else, or to move your setup to another device: you will need the database password to restore it there.

Backups made before WebSSH 33.4 are named `…_webssh.db` and are **not** encrypted: see [Encrypting older backups](#encrypting-older-backups).

Backups are **not** synced through iCloud. [iCloud Sync](/documentation/help/iCloud/) keeps the records of your devices in step; it is not a backup, which is exactly what these files are for.

## The database password
Backups are encrypted with one password per device, the **database password**. It is kept in the Keychain of the device and is never synced through iCloud.

- Until you choose one, **WebSSH generates it** (something like `K7QM-2XHD-9PWA-RT4E-B6NZ-LC3V`), so that no backup is ever written in clear, even the very first one.

The button at the end of the **Database Password** row (or a long press, a right click on the Mac) opens a menu:

- **Show Password** displays it, after Face ID, Touch ID or your passcode. Write it down or save it in a password manager.
- **Set My Password…** replaces it with a password of your own. All the existing backups are then encrypted again with the new password; the progress is shown and may take a few seconds per backup.

On the device that made them, backups restore without asking for anything. The password is needed to restore a backup **on another device**, or after the device itself was erased or restored.

!!! danger "A lost password cannot be recovered"
    WebSSH cannot recover or reset the database password, and neither can we. Without it an encrypted backup is unreadable. If you keep backups outside the device, keep the password too.

??? info "After restoring or replacing your device"
    The database password does not travel with a device backup. WebSSH then generates a new one and keeps backing up. The older backups are still there: when you restore one of them, WebSSH asks for the password they were encrypted with.

Encryption cannot be turned off, and WebSSH never decrypts backups in place. To get a clear copy, [export it](#export-a-backup).

### Encrypting older backups
After updating to WebSSH 33.4, the backups already on the device stay as they were. A row above the list then reads **Some backups are not encrypted. Encrypt them now?** Tap it: each older backup is encrypted with the database password, verified, and only then is the clear file removed. Setting your own password does the same.

### Backups under another password
A backup can be encrypted with a password that is no longer the database password of the device: it came from another device, or the device was restored and WebSSH generated a new password. Such a backup has a padlock with a warning sign and reads **Another password** next to its size.

To restore or export one, WebSSH asks for its password. You type it **once**: every backup that this password opens is then encrypted again with the current database password, and gets its normal padlock back. The password you typed is not saved, and no backup is ever written in clear on the way.

### Choosing a strong password
A bar under the field rates the password you are typing, from **Weak** to **Very strong**. It is an estimate from its length and the kinds of characters used, and it never refuses a password: the choice is yours. A long passphrase rates better than a short mix of symbols.

## How long they are kept
WebSSH thins the folder out each time it writes a backup:

- every backup of the **last 7 days** is kept,
- one per week is kept for the **3 weeks** before that,
- one per month is kept for the **year** before that,
- older files are deleted.

Nothing is deleted while the last backup failed (see above).

A year of history is about twenty small files. There is no size cap. Backups made by hand with mashREPL live in the same folder and follow the same rotation.

## Back up now, restore, delete
- **Backup Now**, at the top right of the screen, writes a backup immediately, even when automatic backups are off.
- **Restore**: long press a backup (right click on the Mac) and choose **Restore**. The backup **replaces** the current database; nothing is merged. Quit and relaunch WebSSH afterwards for the restored data to load. If the backup was encrypted with another password, WebSSH asks for it; a wrong password changes nothing. The database being replaced is itself backed up first, so a restore can be undone.
- **Delete**: same menu. Deleting a backup cannot be undone.

### Export a backup
The same menu holds two export actions, which let you choose the folder where the file is saved (on the device, in iCloud Drive or in any location of the Files app):

- **Export (Encrypted)** asks which password protects the exported file: the database password, or **another password** used for this export only (handy to hand a backup to a colleague without giving away your own password). That other password is not saved.
- **Export (Not Encrypted)** exports the plain SQLite database, after Face ID, Touch ID or your passcode. Anyone who gets that file can read everything in it.

??? warning "Restore and iCloud"
    If iCloud Sync is enabled, disable it and enable it again after a restore, so that the restored data is pushed to your other devices. Connections that exist on iCloud and not in the backup are merged back, not deleted.

??? tip "Take a backup before a risky change"
    Before cleaning up dozens of connections, importing keys or restoring something else, tap **Backup Now**. The file waits in the list for a week at least.

## Turning it off
Switch **Automatic backups** off, on the first row of the **Backups** section. The existing files are left in place and are no longer rotated; **Backup Now** still works.

## From mashREPL
The [mashREPL](/documentation/mashREPL/) commands predate the automatic backups and use the same folder and format:

```
webssh database backup
webssh database restore 20261112_221406_webssh.wsbk
```

mashREPL never asks for a password. A backup encrypted with another password than the one of the device is restored from the Settings screen.

See [Database Backup](mashREPL/database-backup.md) and [Database Restore](mashREPL/database-restore.md).

## For developers
The `.wsbk` format is documented: see [The .wsbk backup file format](wsbk-backup-file-format.md) to decrypt a backup with your own tools and get the SQLite file.

[^1]: Available since WebSSH 32.2
[^2]: Available since WebSSH 33.4
