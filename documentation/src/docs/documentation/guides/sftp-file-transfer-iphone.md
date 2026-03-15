---
title: Transfer Files via SFTP on iPhone and iPad
---

# Transfer Files via SFTP on iPhone and iPad

SFTP (SSH File Transfer Protocol) lets you browse, upload, download, and edit files on a remote server — all over an encrypted SSH connection. WebSSH includes a full SFTP client, so you can manage files on any Linux server, NAS, or VPS directly from your iPhone or iPad.

## What You Can Do with SFTP in WebSSH

- Browse the remote filesystem
- Download files to your iOS device (Files app / iCloud)
- Upload files from your Photos library or Files app
- Edit text files directly on the server with the built-in editor
- Create, rename, and delete files and directories

## Prerequisites

SFTP uses the same connection as SSH — if SSH works, SFTP works. You need:

- A server with SSH/SFTP enabled (Linux, macOS, Synology NAS, Raspberry Pi, VPS...)
- A user account with filesystem access
- WebSSH installed on your iPhone or iPad

## Create an SFTP Connection

1. Open **WebSSH** and tap **+**
2. Switch the connection type from **SSH** to **SFTP**
3. Fill in the fields:
    - **Host:** your server's IP or hostname
    - **Port:** `22` (default)
    - **Username:** your account on the server
    - **Authentication:** password or private key
4. Tap **Save**, then tap the connection to connect

## Downloading Files to Your iPhone or iPad

1. Connect to the server via SFTP
2. Navigate to the file you want to download
3. Tap the file to select it
4. Tap the **Download** icon
5. Choose where to save it — the iOS **Files** app, iCloud Drive, or another app

Files are saved locally and accessible offline through the Files app.

## Uploading Files from Your iPhone or iPad

1. Connect to the server via SFTP
2. Navigate to the destination folder on the server
3. Tap the **Upload** button (arrow up icon)
4. Choose from: **Files app** (any document, including iCloud Drive files)
5. The file is transferred immediately

## Editing Files Directly on the Server

For quick edits — a config file, a script, a text file — you don't need to download, edit, and re-upload. WebSSH's built-in text editor lets you edit files in place:

1. Connect via SFTP
2. Navigate to the file
3. Tap the file to open it in the editor
4. Make your changes
5. Tap **Save** — the file is written back to the server

!!! tip "Search and replace"
    The built-in editor supports search and replace. See [Search and Replace in the Text Editor](/documentation/help/howtos/SFTP/search-replace-text-editor/).

## Use Both SSH and SFTP Together

WebSSH lets you run SSH and SFTP sessions at the same time. A common workflow:

1. Open your SFTP connection to browse and edit files
2. Open a second tab with an SSH connection to run commands
3. Switch between them without losing either session

See [Launching Multiple Terminals](/documentation/help/howtos/launching-multiple-terminals/) for how to manage multiple sessions.

## Authenticate with a Private Key

For regular SFTP access, a private key is more convenient than typing a password every time — and more secure.

1. Go to **Settings → SSH Keys → + → Generate** and create an **ED25519** key
2. Copy the public key and append it to `~/.ssh/authorized_keys` on the server
3. Edit your SFTP connection in WebSSH and set authentication to **Private Key**

See [Create or Import a Public/Private Key Pair](/documentation/help/howtos/create-or-import-public-private-key-pair/) for the step-by-step.

## Sync Connections Across Devices with iCloud

If you use WebSSH on both iPhone and iPad (or a Mac), iCloud Sync keeps all your SFTP connections in sync automatically — no need to re-enter them on each device.

See [iCloud Sync](/documentation/help/iCloud/).

## Troubleshooting

??? question "SFTP connects but I can't see files"
    Check the user's home directory permissions on the server. If you set a startup folder, make sure the path exists and the user has read access.

??? question "Upload fails with permission denied"
    The user account doesn't have write permission on the destination folder. Use SSH to run `ls -la` and check ownership, then `chmod` or `chown` as needed.

??? question "Can't download a whole folder"
    WebSSH currently supports downloading individual files. For folder downloads, zip the folder first via SSH (`zip -r archive.zip folder/`), then download the archive.

??? question "I get 'Must first connect to the SSH server' error"
    See [this error guide](/documentation/help/errors/ssh-sftp-error-must-first-connect-to-the-ssh-server/) for the explanation and fix.

??? question "The interpreter error appears when opening a file"
    See [bad interpreter: no such file or directory](/documentation/help/howtos/SFTP/bad-interpreter-no-such-file-or-directory/) — this is a line ending issue with scripts created on Windows.

## Related Documentation

- [Startup Folder Path](/documentation/help/howtos/SFTP/startup-folder-path/)
- [Search and Replace in Text Editor](/documentation/help/howtos/SFTP/search-replace-text-editor/)
- [iCloud Sync](/documentation/help/iCloud/)
- [Launching Multiple Terminals](/documentation/help/howtos/launching-multiple-terminals/)
- [SSH into Synology NAS from iPhone or iPad](/documentation/guides/synology-ssh-iphone-ipad/)
- [SSH into Raspberry Pi from iPhone or iPad](/documentation/guides/raspberry-pi-ssh-ios/)
