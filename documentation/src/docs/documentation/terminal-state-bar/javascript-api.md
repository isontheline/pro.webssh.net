---
title: State Bar JavaScript API
---
# State Bar JavaScript API
Your own [State Bar](index.md) items are small pieces of JavaScript, executed by WebSSH every 3 seconds while you are not typing. The code runs in a sandbox: there is no DOM, no network and no `require`. Only the objects described on this page are available.

## What the script must return
Wrap your code in an immediately invoked function and return either:

* a **scalar** (String, Number or Boolean): displayed as the label, the icon stays the one set in the settings (or the last one returned);
* an **Item Result Object** (below);
* `undefined` or `null`: the item is **hidden** until a later run returns a value.

```javascript
(function() {
    return 'Hello!';
})();
```

### Item Result Object
| Property | Type | Description |
| --- | --- | --- |
| `label` | String, Number | The text displayed in the State Bar. Numbers are converted to text. Falls back to an empty string. |
| `icon` | String (optional) | An [SF Symbol](https://developer.apple.com/sf-symbols/) name. When omitted, the last icon set is kept (the one from the settings on the first run). |
| `tint`[^3] | String (optional) | `normal` (default), `success`, `warning` or `error`. Colours the icon and the label (green, orange, red) and tints the item background, exactly like the fixed connection item. Anything else is treated as `normal`. |
| `badge`[^3] | Number, String (optional) | A small capsule drawn on the top right corner of the icon, for counts (pending updates, alerts…). `0`, an empty string or an absent value removes it. |
| `progress`[^3] | Number (optional) | `0` to `1`. Replaces the icon with a small progress ring. Values outside the range are clamped. |
| `value`[^3] | Number (optional) | The numeric value used by the [sparkline](index.md#graph). When omitted, the first number found in `label` is used. |

```javascript
(function() {
    return {
        label: '42 %',
        icon: 'gauge.with.dots.needle.50percent'
    };
})();
```

A tinted item with a progress ring and an explicit value:

```javascript
(function() {
    let used = 85
    return {
        label: used + ' %',
        progress: used / 100,
        tint: used >= 90 ? 'error' : (used >= 75 ? 'warning' : 'normal'),
        value: used
    };
})();
```

!!! tip "Sparkline"
    The script has nothing to do for the sparkline: enable *Graph* in the item settings and WebSSH keeps the last 30 numeric values (from `value`, or the first number of `label`) and draws them next to the label.

## `$ssh`
| Function | Returns | Description |
| --- | --- | --- |
| `$ssh.exec(command)` | String or `null` | Runs `command` on the remote server (SSH session) and returns its output. Returns `null` when the connection is down or the command fails. **Avoid long running commands**: wrap them with the [Linux `timeout`](https://www.man7.org/linux/man-pages/man1/timeout.1.html) command. |
| `$ssh.isConnected()` | Boolean | Whether the SSH connection is established. |

!!! note "mosh sessions"
    On a mosh session `$ssh` still exists for compatibility, but `$ssh.exec` always returns `null` (there is no SSH session any more once mosh-server is started, and the mosh protocol has no side channel). `$ssh.isConnected()` is true when the server answered recently. Use [`$mosh`](#mosh) for the details.

## `$mosh`
Available on mosh sessions only (since WebSSH 32.9). Test for it with `typeof $mosh !== 'undefined'`.

| Function | Returns | Description |
| --- | --- | --- |
| `$mosh.state()` | String | `connecting`, `connected`, `stale` (no recent contact), `suspended` or `closed`. |
| `$mosh.isAlive()` | Boolean | True while the session exists, including when stale or suspended. |
| `$mosh.isConnected()` | Boolean | True when the server answered recently. |
| `$mosh.secondsSinceLastContact()` | Number | Seconds since the last datagram from the server, `-1` when the server was never heard. |

## `$terminal`
Since WebSSH 30.5.

| Function | Returns | Description |
| --- | --- | --- |
| `$terminal.getCols()` | Number | The number of columns of the terminal. |
| `$terminal.getRows()` | Number | The number of rows of the terminal. |

## `$vars`
A small key / value store to keep data between two runs of your script, or to share data between items. It is not persistent: it is reset when the session ends.

| Function | Description |
| --- | --- |
| `$vars.set(key, value)` | Stores `value`. The key is private to the item, unless it starts with `GLOBAL_`: it is then shared with every item of the session. Keys starting with `WEBSSH_` are read-only, writing them is refused. |
| `$vars.get(key)` | Returns the stored value, or `undefined`. |
| `$vars.get(key, fallback)` | Returns the stored value, or `fallback` when the key is not set. |

Any JSON compatible value can be stored (strings, numbers, booleans, arrays, objects).

### `WEBSSH_` variables
Read-only variables describing the current session, filled when the State Bar is created. They are available on every saved connection (SSH and mosh).

| Key | Example | Description |
| --- | --- | --- |
| `WEBSSH_CONNECTION_NAME` | `My SSH Server` | The name of the connection. |
| `WEBSSH_CONNECTION_HOST` | `ssh.example.com` | The host of the connection, as typed in the connection form. |
| `WEBSSH_CONNECTION_USERNAME`[^1] | `root` | The login user. |
| `WEBSSH_CONNECTION_ICON`[^2] | `server.rack` | The SF Symbol chosen as the connection icon. |
| `WEBSSH_CONNECTION_ADDRESS` | `172.21.0.40` | SSH only. The address handed to the SSH engine: the first resolved IP address, or the hostname itself when the DNS strategy of the connection is *passthrough*. |
| `WEBSSH_CONNECTION_SERVER_IDENTIFIER` | `SSH-2.0-OpenSSH_9.6` | SSH only. The banner sent by the SSH server. |

A missing variable returns `undefined`: always provide a fallback (`$vars.get('WEBSSH_CONNECTION_ADDRESS', '')`).

## `console`
`console.log`, `console.info`, `console.warn`, `console.error`, `console.debug` and `console.trace` take a single string and write it to the WebSSH log, prefixed with the item identifier. Nothing is shown in the terminal.

The log is a daily file stored in the WebSSH folder of the Files app (macOS: the app's Documents folder), kept for 7 days. It is only written when *File Logger Level* in Settings → Advanced Settings is not disabled; `console.debug` and `console.trace` need the Debug level, `console.log` and `console.info` the Info level.

## Error handling
A JavaScript exception is written to the log (see `console` above) and, as the script returned nothing, the item is hidden until a later run succeeds. A malformed Item Result Object (for example an `icon` that is not a string) is logged too and the item keeps its previous content.

[^1]: Since WebSSH 29.6.
[^2]: Since WebSSH 32.10. Before that version `WEBSSH_CONNECTION_NAME`, `WEBSSH_CONNECTION_HOST` and `WEBSSH_CONNECTION_USERNAME` were only filled on SSH sessions.
[^3]: Since WebSSH 32.10.
