# Contributing a State Bar Item

This folder is the **WebSSH Library** of Terminal State Bar items, browsed in the app:
**Settings → Terminal → State Bar → [+] → WebSSH Library**. User documentation:
[State Bar Library](https://webssh.net/documentation/terminal-state-bar/library/).

```
statebar/
├── index.md              catalog: sections and collections (parsed by the app)
└── <collection>/         one folder per theme
    ├── webssh.json       REQUIRED manifest
    └── <item>.js         one file per item
```

Every pull request is validated by [`validate_statebar.yml`](../.github/workflows/validate_statebar.yml).
Run it locally from the repository root: `python3 .github/scripts/validate_statebar.py`.

## The script

One immediately invoked function, as described in the
[JavaScript API](https://webssh.net/documentation/terminal-state-bar/javascript-api/): it returns a label,
an [Item Result Object](https://webssh.net/documentation/terminal-state-bar/javascript-api/#item-result-object),
or `null` to hide the item.

```javascript
(function() {
    let load = $ssh.exec("timeout -k 1s 1s cut -d ' ' -f 1-3 /proc/loadavg")
    if (!load) {
        return null;
    }
    return { label: load.trim(), icon: 'chart.line.uptrend.xyaxis', value: parseFloat(load) };
})();
```

Rules:

- `.js`, UTF-8, **8 KB** at most, file name `lowercase-with-dashes.js`.
- **Read only.** An item runs every few seconds without the user asking: it must never change anything on the server.
- Wrap every remote command in `timeout` (`timeout -k 1s 1s …`): the State Bar waits for the command.
- Return `null` when there is nothing to show (command missing, no sensor…): never an error text.
- Prefer hiding the item when all is fine (`pending updates`, `failed services`…): a quiet bar is a useful bar.
- Use `tint`, `badge`, `progress` and `value` rather than text when they say it better.
- No `eval()`, no `Function()`.

### Variables

Anything the user must personalize is a **variable**, never a constant to edit:

```javascript
let city = '{{{ CITY : Paris }}}'
let base = '{{{ HOME_ASSISTANT_URL : "http://homeassistant.local:8123" }}}'
let token = '{{{ TOKEN | secret }}}'
let units = '{{{ UNITS : metric : imperial }}}'
```

Same grammar as [snippet variables](https://webssh.net/documentation/help/howtos/snippets/#dynamic-variables).
Always inside a string literal (the app escapes the value). A default holding `:` or `|` (any URL) **must** be
wrapped in double quotes. `| secret` masks the field. The app asks for the values at import and the user edits them later
in the item editor; they survive an update of the script.

## `webssh.json`

```json
{
  "version": 1,
  "files": {
    "weather.js": {
      "name": "Weather",
      "summary": "Temperature with an icon that follows the sky",
      "icon": "cloud.sun",
      "session": ["ssh", "mosh"],
      "interval": 600,
      "hosts": ["wttr.in"],
      "maintainers": ["isontheline"]
    }
  }
}
```

| Key | Required | Description |
| --- | --- | --- |
| `name` | yes | Name of the imported item. |
| `summary` | yes | One line, English. |
| `icon` | yes | [SF Symbols](https://developer.apple.com/sf-symbols/) name, the initial icon of the item. |
| `session` | yes | Where the item is useful: `ssh`, `mosh`. An item that calls `$ssh.exec` is `["ssh"]` only. |
| `os` | no | Remote systems the commands need: `linux`, `macos`, `freebsd`, `openbsd`, `windows`. |
| `interval` | no | Refresh interval in seconds, 1 to 600 (default 3). **At least 10 with `hosts`.** Be kind to public APIs: minutes, not seconds. |
| `graph` | no | `off` (default), `sparkline` or `sparkline-only`. The script then returns a numeric `value`. |
| `hosts` | with `$http` | Hosts the script contacts, shown to the user who must allow them. Exact host, `*.example.com`, or a variable: `"{{{ URL }}}"` (the host is taken from the value). Every literal URL of the script must be covered. |
| `packages` | no | Packages the commands rely on: `{ "apt": "curl", "dnf": "curl" }`. Managers: `apt dnf apk pacman zypper brew pkg`. |
| `maintainers` | yes | GitHub usernames. |

Every file of the folder must be listed, and every listed file must exist.

## `index.md`

```markdown
# Section
- [Collection title](folder) — subtitle `ssh` `http` `linux`
```

The link is the bare folder name. Trailing backticked markers become filter chips: `ssh`, `mosh`, `http`,
then the remote systems. A new collection must be added to `index.md`, otherwise it is unreachable in the app.
