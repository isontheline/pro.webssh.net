---
title: SCP File Browser
seo_title: "SCP on iPhone, iPad and Mac: Browse and Transfer Files Without SFTP - WebSSH"
description: "Use SCP in WebSSH to browse, upload and download files on hosts that have no SFTP subsystem, or open a file browser straight from an SSH terminal without logging in again, including through jump hosts."
---

# SCP File Browser[^1]
[SFTP](/documentation/guides/sftp-file-transfer-iphone/) is the usual way to manage files over SSH, but it needs the `sftp-server` subsystem on the host. Routers, switches, appliances, minimal containers and BusyBox systems often ship without it, while `scp` and a plain shell are there. Since WebSSH 32.9, **SCP** gives these hosts the same file browser as SFTP: transfers use the SCP protocol over your SSH session, and everything else (listing, rename, delete, folders) is done with standard shell commands.

SCP also powers **Browse Files (SCP)**, a file browser opened from an SSH terminal that reuses the terminal's connection: no second login, no second 2FA, and it works through [jump hosts](/documentation/guides/ssh-jump-host-bastion-iphone-ipad-mac/).

## Two ways to use SCP
=== "SCP role on a connection"
    1. Edit the connection and open **Roles**
    2. Enable **SCP** (the **SSH** role is added automatically, SCP rides on it)
    3. Save

    Launch it from the capability picker of the server (the teal folder tile, key `c` on a hardware keyboard) or from the **SCP** entry of its context menu. SCP hosts are also listed in the **SFTP** tab of the server list. The browser opens in the folder marked *Use as default path* in the favorites, otherwise in the home directory.

    This is a separate login: WebSSH opens its own SSH connection for the browser, with the same password, key or 2FA prompts as a terminal.

=== "Browse Files (SCP) from a terminal"
    From an open SSH terminal, open the **⋯** menu and choose **Browse Files (SCP)**. On the Mac it is also in the menu bar, **Connection ▸ Browse Files (SCP)**, and on both Mac and iPad with a hardware keyboard the shortcut is **⌘⇧O**.

    The browser borrows the terminal's authenticated session, so nothing is asked again, and it goes through whatever jump host chain the terminal used. It opens in the home directory. Choosing the action again brings back the same browser.

    On the Mac, and on iPad when [split panes](split-panes-and-broadcast-input.md) are enabled for iPadOS, the browser opens in a new pane next to the terminal. Elsewhere it opens on top of the terminal.

    Each file of this browser has an **Insert** entry in its context menu: it types the file path at the terminal prompt, quoted when needed, and gives the focus back to the terminal. Browse to the file, insert it, type the rest of the command.

    The terminal output pauses while an SCP operation runs and resumes right after. This browser is only offered on SSH terminals, not on Telnet or on the local shell.

## What you can do
The SCP browser is the same screen as the SFTP one: browse, sort, show hidden files, upload and download files, upload and download whole folders, create files and folders, rename, delete, view images, edit text files in the [Text Editor](/documentation/help/howtos/SFTP/search-replace-text-editor/), share, copy a path or a name, favorites, *Jump to* a path, drag and drop.

Differences with SFTP, due to the protocol:

- **No resume**: an interrupted transfer starts again from the beginning; the *Resume* button of the "already exists" dialog is replaced by *Overwrite* only.
- **Whole files only**: opening an image or a text file downloads the entire file first, so very large files take a while to open. Image preview stops at 2 GB.
- **Times are shown to the minute**, as reported by `ls`.
- **Deleting a non-empty folder** runs a single `rm -rf` after confirmation, without per-file progress.

## What the host needs
- An SSH login that lands in a **POSIX shell** (`sh`, `bash`, `ash`, `dash`…). WebSSH checks it when the browser opens; a restricted or jailed login shows *This host does not provide a POSIX shell, which SCP browsing requires. Please use SFTP instead if available.*
- The usual commands `ls`, `mkdir`, `rm`, `mv`, `pwd`. GNU, BSD, macOS and BusyBox variants of `ls` are all understood.
- An `scp` binary for the transfers themselves. Listing, rename and delete work without it.

File and folder names containing a line break are not supported and are refused with *Unsupported character in path*.

## SFTP or SCP?
| Situation | Pick |
| --- | --- |
| Linux server, NAS, VPS with a standard OpenSSH | SFTP: resumable transfers, partial reads, exact timestamps |
| Router, switch, appliance, container without `sftp-server` | SCP |
| Quick look at files from a terminal you already have open, especially behind a jump host | Browse Files (SCP) |
| Login lands in a restricted shell | SFTP, if the host offers it |

SCP is available in the FREE version. Jump hosts and dropping files onto the terminal to upload them are [WebSSH PRO](/documentation/pricing/) features.

[^1]: Available since WebSSH 32.9
