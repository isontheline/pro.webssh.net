---
title: Import Snippets from GitHub Gist
seo_title: "Import SSH Snippets from a GitHub Gist into WebSSH (iPhone, iPad, Mac)"
description: "Turn the files of a public GitHub Gist into WebSSH snippets, browse a user's gists, refresh a snippet from its source later, and describe your gist with an optional webssh.json manifest."
---

# Import Snippets from GitHub Gist[^1]
A GitHub Gist is a handy place to keep the shell commands you reuse: it is versioned, shareable and editable from any browser. Since WebSSH 32.7 you can import the files of a gist as [snippets](snippets.md), and later refresh a snippet from the gist when you have improved the command there.

The import is **one way and manual**: WebSSH reads the gist, nothing is ever written back to GitHub, and nothing runs in the background. The only thing WebSSH remembers is the link between a snippet and the gist file it came from.

??? info "Public gists, no account"
    WebSSH talks to GitHub anonymously, with no token and no login. It can read public gists and, when you paste a direct link, secret gists ("anyone with the link"). Gists of a private account are out of reach.

## Import a gist
1. Open the **Snippets** screen (or the snippet picker inside a terminal session)
2. Press the **•••** button in the navigation bar and choose **Import from Gist…**
3. Paste a gist URL in the field, then press **Search**
4. Tick the files you want, then press **Import**

Each file becomes one snippet. The "i" button next to a file shows its content, syntax highlighted, before you import it. A Safari button in the toolbar opens the gist in your browser.

The import field accepts more than a gist URL:

| You type | WebSSH shows |
| --- | --- |
| `https://gist.github.com/<owner>/<id>` or a bare gist ID | The files of that gist |
| A raw file URL (`gist.githubusercontent.com/…`) | The whole gist the file belongs to |
| `username` or `@username` | The public gists of that user, newest first, pick one to see its files |
| Anything else | A search on gist.github.com in the WebSSH web browser; on any gist page, press **Import** (or the blue ribbon at the top of the page) to import it |

A `github.com/<owner>/<repo>` link is not a gist and is refused as such.

## What becomes what
- **Name**: the file name, without its extension for shell-like files (`.sh`, `.bash`, `.zsh`, `.ksh`, `.fish`, `.txt`, `.command`, `.ps1`, `.ks`). Other extensions stay in the name, so `backup.py` is imported as `backup.py`.
- **Content**: stored exactly as it is in the gist. [Dynamic variables](snippets.md#dynamic-variables) written as `{{{ NAME }}}` work as in any snippet.
- **Icon**: picked from the language GitHub detects for the file (a terminal icon for shell scripts, braces for JSON and YAML, a document for text and Markdown).
- **Tags**: none. An imported snippet matches every connection until you add [tags](link-connections-using-tags.md) to it in the editor.

Files larger than 256 KB and binary files are listed as *File skipped (binary or too large)* and cannot be selected. A file named `webssh.json` is never imported: it is the optional manifest described below.

## Refresh a snippet from its source
An imported snippet carries a link badge on its card, and its editor shows the source link with the note *Imported from a Gist — re-importing the same file will overwrite this command*.

To pull the latest version of the command:

- long press the snippet card and choose **Refresh from Source**, or
- open the snippet and press the refresh button in the navigation bar.

The refresh replaces the **content only**. The name, tags, favorite flag and icon you set in WebSSH are kept. Local edits made to the content are overwritten without confirmation, so keep your own changes in the gist. If the file was renamed or deleted in the gist, the refresh fails with *Gist not found*.

Importing the same gist again also works as an update: files that already exist in WebSSH are marked *Will update "name"*, and a confirmation lists the snippets about to be overwritten before anything happens.

??? note "Keep a personal variant"
    **Duplicate** creates a copy of the snippet without the source link. The copy is yours: it is never matched by a later import nor touched by a refresh.

## Describe your gist with webssh.json
Add a file named `webssh.json` to the gist to document each command. It is optional: a gist without it imports fine, and a malformed manifest is simply ignored.

```json
{
  "version": 1,
  "files": {
    "disk-usage.sh": {
      "name": "Disk usage by folder",
      "summary": "Largest folders under the current path",
      "os": ["linux", "macos"],
      "icon": "internaldrive",
      "packages": { "apt": "ncdu", "brew": "ncdu" },
      "danger": false,
      "root": false
    }
  }
}
```

| Key | Effect |
| --- | --- |
| `name` | Name of the snippet in WebSSH, instead of the file name |
| `icon` | SF Symbol used as the snippet icon |
| `summary` | One line shown under the file name in the picker |
| `os` | Badges in the picker: `linux`, `macos`, `windows`, `freebsd`, `openbsd`, `ios` |
| `packages` | Packages the command relies on, shown per package manager (`apt`, `dnf`, `brew`…) |
| `danger` | `true` flags the file as a *Potentially destructive command* (orange warning) |
| `root` | `true` flags the file as *Requires root privileges* |
| `maintainers` | GitHub usernames of the people maintaining the file |

Only `name` and `icon` change the stored snippet. The other keys only inform the person importing: WebSSH never blocks an import, and it does not analyse commands itself, so the `danger` flag is only as reliable as the gist author.

The same manifest format drives the **WebSSH Library**, the curated collection of snippets published in the [snippets folder](https://github.com/isontheline/pro.webssh.net/tree/master/snippets) of the WebSSH repository and reachable from the same **•••** menu. Pull requests are welcome there.

## Good to know
- **Free version**: the FREE tier holds 3 snippets. The picker shows how many free slots are left; updates of existing snippets never consume a slot. Importing is otherwise not a PRO feature.
- **Rate limit**: GitHub allows 60 anonymous requests per hour and per IP address. When it is reached, WebSSH tells you at what time to try again.
- **Secret gists**: a gist that is not public is marked *This Gist is not public — anyone with the link can read it*. It can still be imported from its direct link.
- **iCloud**: imported snippets sync like any other snippet when [iCloud Sync](/documentation/help/iCloud/) is enabled.
- **Nothing runs on import**: a snippet only runs when you choose it in a terminal, as usual.

[^1]: Available since WebSSH 32.7
