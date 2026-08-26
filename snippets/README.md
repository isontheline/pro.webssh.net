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
7. **Two file kinds only** — each with its own CI validator, so nothing dodges
   review:
   - `.sh` — shell snippets, ShellCheck-verified.
   - `.ks` — **key sequences**: WebSSH expands `<ctrl-x>` tokens into the real
     control character when running the snippet (e.g. `<ctrl-b>[` enters tmux
     copy mode). One single line, **no trailing newline**, at least one token,
     little literal text. Newlines and `<ctrl-j>`/`<ctrl-m>` are rejected —
     they are Enter, so a `.ks` can *type* keys but never *execute* a command
     by itself.

## `webssh.json` manifest

```json
{
  "version": 1,
  "files": {
    "docker-cleanup.sh": {
      "name": "Docker Cleanup",
      "summary": "Prune unused images, containers and volumes",
      "os": ["linux"],
      "danger": true,
      "icon": "shippingbox",
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
- `icon` — optional [SF Symbols](https://developer.apple.com/sf-symbols/) name
  applied to the imported snippet (e.g. `network`, `shippingbox`, `externaldrive`).
  Prefer symbols available since SF Symbols 1/2: on devices whose OS does not
  know the symbol yet, the app silently falls back to a default snippet icon.
- `root` — set to `true` when the command needs root privileges to be useful
  (`lastb`, `nethogs`…). The app shows a discreet key badge; don't put `sudo`
  in the snippet itself.
- `maintainers` — GitHub usernames of the snippet's contributors (per-file
  only) — add yourself there when contributing a snippet.
- `packages` — map of package manager (`apt`, `dnf`, `apk`, `pacman`, `zypper`, `brew`, `pkg`)
  to package name(s). Informative only; omit for tools preinstalled everywhere.
- `examples` — up to 15 documented variants of the command, each
  `{"command": "ncdu -x /var", "comment": "Focus on /var"}` (`comment` is
  optional, `command` ≤ 200 chars). Shown on the snippet sheet; users can
  copy one or import it as their own snippet. Keep them genuinely different
  from the base command — teaching moments, not filler.
- `name` — optional clean display name ("Public IP Address" beats
  *public-ip-address*); it becomes the snippet name on import. Omitted ⇒ the
  filename (minus its extension) is used.
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
