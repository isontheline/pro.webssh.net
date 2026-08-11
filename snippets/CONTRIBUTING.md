# Contributing a Snippet

Thanks for sharing! Curated snippets ship inside the [WebSSH](https://webssh.net) app,
where users import them into their snippet library and run them in live SSH sessions —
so quality and safety matter more than quantity.

## Layout

```
snippets/
├── index.md              ← the catalog shown in-app (sections + collection links)
└── <collection>/         ← one folder per themed collection
    ├── webssh.json       ← REQUIRED manifest (the app relies on it)
    └── my-snippet.sh     ← one file per snippet
```

## Rules

1. **One command (or short self-contained block) per file.** Each line is typed into
   the user's terminal followed by Enter — no long scripts, no interactive wizards.
2. **UTF-8 text, ≤ 1 KB** per file (the app skips anything else — snippets are
   useful commands, not full migration scripts).
3. **Clean filename**: it becomes the snippet name (`docker-cleanup.sh` → *docker-cleanup*).
4. **Portable by default**: prefer POSIX-compatible commands; declare OS support and
   required packages in the manifest instead of assuming them.
5. **Flag destructive commands** (`danger: true`) — anything that deletes, prunes,
   overwrites or reboots.
6. Every file of the collection **must be listed** in `webssh.json` — unlisted files
   are invisible to the app.

## `webssh.json` manifest

```json
{
  "version": 1,
  "files": {
    "docker-cleanup.sh": {
      "summary": "Prune unused images, containers and volumes",
      "os": ["linux"],
      "danger": true,
      "maintainers": ["your-github-username"],
      "packages": {
        "apt": "docker.io",
        "dnf": "docker",
        "brew": "docker"
      }
    }
  }
}
```

- `os` values: `linux`, `macos`, `windows`, `freebsd`, `openbsd`.
- `danger` — set to `true` on any command that deletes, prunes, overwrites or
  reboots. The app shows a warning triangle next to the file before import,
  so users know what they are about to run. Reviewers will ask for it on
  destructive commands — when in doubt, flag it.
- `maintainers` — GitHub usernames of the snippet's contributors (per-file
  only) — add yourself there when contributing a snippet.
- `packages` — map of package manager (`apt`, `dnf`, `apk`, `pacman`, `zypper`, `brew`, `pkg`)
  to package name(s). Informative only; omit for tools preinstalled everywhere.
- `summary` — one line, English, shown under the filename in the app.

## Adding your collection to the catalog

Add one line to [`index.md`](index.md) under the right section (or open a new `# Section`):

```markdown
- [My Collection](https://github.com/isontheline/pro.webssh.net/tree/master/snippets/my-collection) — What it does `linux` `macos`
```

The trailing backticked tokens are OS markers used by the in-app filter chips.

## Process

1. Fork, create your collection folder, open a Pull Request.
2. CI validates the manifest, the file listing and runs ShellCheck on `.sh` files.
3. A maintainer reviews (especially `danger` flags) and merges.
   Merged content appears in the app within a few minutes (CDN cache).
