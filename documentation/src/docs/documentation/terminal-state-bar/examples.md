---
title: State Bar Examples
---
# State Bar Examples
Ready to paste items for the [State Bar](index.md). Create an item (Settings → Terminal → State Bar → Add), give it a name and an icon, and paste the script. See the [JavaScript API](javascript-api.md) for the details of what a script can use.

!!! tip "Built-in first"
    Several of these examples now exist as [built-in items](index.md#built-in-items) (connection, address, terminal size…). They are kept here because they are the simplest way to learn how items work.

## Session

### Connection name and icon
Displays the connection name with its own icon. Since 32.10 this is exactly what the built-in *Connection* item does.

```javascript
(function() {
    return {
        label: $vars.get('WEBSSH_CONNECTION_NAME', $vars.get('WEBSSH_CONNECTION_HOST', '')),
        icon: $vars.get('WEBSSH_CONNECTION_ICON', 'server.rack')
    };
})();
```

### Connectivity indicator
Shows a plugged cable while the SSH connection is up, an unplugged one otherwise, with the connection name as label. No `$ssh.exec` involved, so it never blocks.

```javascript
(function() {
    let icon = $ssh.isConnected() ? 'cable.connector' : 'cable.connector.slash'
    return {
        label: $vars.get('WEBSSH_CONNECTION_NAME', ''),
        icon
    }
})();
```

### Resolved address
Returns a scalar: the label is the address and the icon stays the one set in the settings. With the *passthrough* DNS strategy the value is the hostname.

```javascript
(function() {
    return $vars.get('WEBSSH_CONNECTION_ADDRESS', '');
})();
```

### Terminal size
Columns × rows, refreshed when the terminal is resized.

```javascript
(function() {
    return {
        label: $terminal.getCols() + 'x' + $terminal.getRows(),
        icon: 'rectangle.expand.diagonal'
    }
})();
```

### mosh transport state
On a mosh session, shows the state of the transport and the time since the last contact when it is stale. Hidden on SSH sessions.

```javascript
(function() {
    if (typeof $mosh === 'undefined') {
        return null;
    }
    const state = $mosh.state();
    if (state === 'stale') {
        return {
            label: Math.round($mosh.secondsSinceLastContact()) + ' s',
            icon: 'antenna.radiowaves.left.and.right.slash'
        };
    }
    return {
        label: state,
        icon: state === 'connected' ? 'antenna.radiowaves.left.and.right' : 'pause.circle'
    };
})();
```

## Remote commands
These examples run a command on the server with `$ssh.exec`. Always bound the execution time with `timeout`, the State Bar waits for the command to finish.

### Remote date
```javascript
(function() {
    let date = $ssh.exec('timeout -k 1s 1s date')
    return {
        label: date,
        icon: 'calendar'
    }
})();
```

### Used disk space on /
`df` can hang on a stalled mount, hence the 1 second limit.

```javascript
(function() {
    return $ssh.exec("timeout -k 1s 1s df -h / | awk 'NR==2 {print $3}'")
})();
```

### Load average
```javascript
(function() {
    let load = $ssh.exec("timeout -k 1s 1s cut -d ' ' -f 1-3 /proc/loadavg")
    if (!load) {
        return null;
    }
    return {
        label: load.trim(),
        icon: 'chart.line.uptrend.xyaxis'
    }
})();
```

### CPU usage (Linux)
Reads `/proc/stat`, keeps the previous snapshot in `$vars` and computes the usage over the last interval. The icon follows the usage. Linux only.

```javascript
(function() {
    // Not connected : empty label and default icon
    if (!$ssh.isConnected()) {
        return {
            label: '',
            icon: 'tachometer'
        };
    }

    /**
     * Parse the first "cpu" line of /proc/stat and compute
     * - total time (sum of all fields)
     * - idle time (idle + iowait)
     */
    function extractCpuTimes(statOutput) {
        const line = statOutput.split('\n').find(l => l.startsWith('cpu '));
        // user, nice, system, idle, iowait, irq, softirq
        const parts = line.trim().split(/\s+/).slice(1, 8).map(Number);
        const total = parts.reduce((sum, val) => sum + val, 0);
        const idle = parts[3] + parts[4];
        return { total, idle };
    }

    const procStatContent = $ssh.exec('timeout -k 1s 1s cat /proc/stat');
    if (!procStatContent) {
        console.warn('Failed to read /proc/stat');
        return {
            label: '',
            icon: 'tachometer'
        };
    }

    const newStat = extractCpuTimes(procStatContent);
    // Previous snapshot (or the current one on the first run)
    const oldStat = $vars.get('CPU_STAT', newStat);
    $vars.set('CPU_STAT', newStat);

    const totalDiff = newStat.total - oldStat.total;
    const idleDiff = newStat.idle - oldStat.idle;
    const usagePercent = totalDiff > 0
        ? Math.round(100 * (totalDiff - idleDiff) / totalDiff)
        : 0;

    let icon;
    if (usagePercent < 33) {
        icon = 'gauge.with.dots.needle.0percent';
    } else if (usagePercent < 50) {
        icon = 'gauge.with.dots.needle.33percent';
    } else if (usagePercent < 67) {
        icon = 'gauge.with.dots.needle.50percent';
    } else if (usagePercent < 80) {
        icon = 'gauge.with.dots.needle.67percent';
    } else {
        icon = 'gauge.with.dots.needle.100percent';
    }

    return { label: usagePercent + '%', icon };
})();
```

## Sharing data between items
A key stored with the `GLOBAL_` prefix is visible to every item of the session. Here a first item reads the uptime once and a second one displays it, without a second remote command.

Producer item:

```javascript
(function() {
    let uptime = $ssh.exec('timeout -k 1s 1s uptime -p')
    $vars.set('GLOBAL_UPTIME', uptime ? uptime.trim() : '')
    return uptime ? { label: uptime.trim(), icon: 'clock' } : null;
})();
```

Consumer item:

```javascript
(function() {
    let uptime = $vars.get('GLOBAL_UPTIME', '')
    return uptime ? { label: uptime.replace('up ', ''), icon: 'power' } : null;
})();
```

Items run in the order of the list, so put the producer before the consumer.
