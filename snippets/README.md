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

## Tested in WebSSH, on a real host

A snippet is accepted only if **you have run it in WebSSH**: created in your snippet library
with the exact content of the file, then run in a live session opened to a real machine that
has what the command needs (the service, the package, the hardware). CI checks the layout and
the shell syntax, not the behaviour: a run in another terminal does not show how the snippet is
typed, how its dynamic variables are asked, or how a key sequence is expanded by the app.

The pull request description must include:

- a **screenshot of each snippet run in a WebSSH session** (and of the variables sheet when
  the snippet has dynamic variables);
- the **system and version** of the tested host (`Debian 13`, `macOS 26`…) and the version of
  the tools involved;
- what you could not test (other systems listed in `os`, the destructive path of a
  `danger` snippet…).

A pull request without these is closed without review. No device or no WebSSH at hand? Open an
[issue](https://github.com/isontheline/pro.webssh.net/issues) describing the snippet instead:
the idea is welcome, and someone able to test it can pick it up.

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
   - `.sh` — shell snippets, ShellCheck-verified. They may ask the user for
     values with **dynamic variables** (`{{{ NAME }}}`, `{{{ NAME : default }}}`,
     `{{{ NAME : first : second }}}` for a choice, `{{{ NAME : default | secret }}}`
     for a hidden value — see the
     [documentation](https://webssh.net/documentation/help/howtos/snippets/#dynamic-variables)).
     CI validates every placeholder and runs ShellCheck on a copy where each
     placeholder is replaced by its default (first choice for a list, the name
     itself when empty), so give a realistic default. Built-in names
     (`HOST`, `USER`, `PORT`, `CONNECTION`, `DATE`) are prefilled from the
     connection. `.ks` files must not contain `{{{`.
   - `.ks` — **key sequences**: WebSSH expands key tokens into the real bytes
     when running the snippet (e.g. `<ctrl-b>[` enters tmux copy mode,
     `<esc>:wq` leaves vim). One single line, **no trailing newline**, at
     least one token, little literal text. Tokens (lowercase):
     - `<ctrl-x>` — control character, `x` a letter `a`-`z` or one of
       `[ \ ] ^ _ @ /`;
     - `<alt-x>` — Escape then `x`, one printable ASCII character, case
       preserved (`<alt-b>` and `<alt-B>` differ);
     - `<esc>` — Escape (same as `<ctrl-[>`);
     - `<tab>` — Tab (same as `<ctrl-i>`).

     Newlines, `<ctrl-j>`/`<ctrl-m>` (Enter) and `<ctrl-o>` (readline's
     *operate-and-get-next*, which also runs the line) are rejected, so a
     `.ks` can *type* keys but never *execute* a command by itself. For the
     same reason an Escape followed by `[` or `O` is rejected (from `<esc>[`,
     `<ctrl-[>O`, `<alt-[>`, `<alt-O>`…): it would forge a terminal escape
     sequence such as keypad Enter.

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
  CI rejects a name that is missing from
  [`sf_symbols.txt`](../.github/scripts/sf_symbols.txt), the symbols available on
  the oldest iOS the app supports: an unknown or too recent symbol would silently
  fall back to a default snippet icon.
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

1. Fork, create your collection folder, test every snippet in WebSSH (see above), open a
   Pull Request.
2. CI validates the manifest, the file listing and runs ShellCheck on `.sh` files.
3. A maintainer reviews (especially `danger` flags) and merges.
   Merged content appears in the app within a few minutes (CDN cache).

Passing the checks is not an acceptance: see the repository's
[contribution policy](../CONTRIBUTING.md).
