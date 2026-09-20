---
title: State Bar Examples
---
# State Bar Examples
Ready to paste items for the [State Bar](index.md). Create an item (Settings → Terminal → State Bar → Add), give it a name and an icon, and paste the script. See the [JavaScript API](javascript-api.md) for the details of what a script can use.

!!! tip "Built-in first"
    Several of these examples now exist as [built-in items](index.md#built-in-items) (connection, address, terminal size…). They are kept here because they are the simplest way to learn how items work.

## Session

### Connection name and icon
Displays the connection name with its own icon. Since 32.10 this is exactly what the built-in *Connection name* item does.

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

### Disk usage with a progress ring and a tint
Same command, but the percentage drives a progress ring instead of the icon, and the item turns orange above 75 % and red above 90 %. With *Graph* enabled, the sparkline follows the percentage.

```javascript
(function() {
    let raw = $ssh.exec("timeout -k 1s 1s df / | awk 'NR==2 {print $5}'")
    if (!raw) {
        return null;
    }
    let percent = parseInt(raw, 10)
    return {
        label: percent + ' %',
        progress: percent / 100,
        tint: percent >= 90 ? 'error' : (percent >= 75 ? 'warning' : 'normal'),
        value: percent
    }
})();
```

### Pending updates with a badge
Debian / Ubuntu: counts the upgradable packages and shows the count as a badge on the icon. Hidden when everything is up to date. `apt list` reads the local cache only, so it is fast, but keep the `timeout` anyway. The count rarely changes: set the item's [refresh interval](index.md#refresh-interval) to 5 or 10 minutes.

```javascript
(function() {
    let raw = $ssh.exec("timeout -k 2s 2s apt list --upgradable 2>/dev/null | grep -c upgradable")
    if (raw === null) {
        return null;
    }
    let count = parseInt(raw, 10) || 0
    if (count === 0) {
        return null;
    }
    return {
        label: '',
        icon: 'shippingbox',
        badge: count,
        tint: count > 20 ? 'warning' : 'normal'
    }
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

## Web APIs
Since WebSSH 32.10 a script can call web services with [`$http`](javascript-api.md#http). For each of these examples, turn on **Network Access** in the item and copy the given host into **Allowed Hosts** ([why](index.md#network-access)). Requests are sent by your device, so all of them work on mosh sessions too. These are public services: be kind to them and use the suggested [refresh interval](index.md#refresh-interval).

### Public IP address
Allowed hosts: `api.ipify.org`. Refresh: 5 minutes. The public address of your device (not the one of the server).

```javascript
(function() {
    let r = $http.get('https://api.ipify.org')
    return r && r.ok ? { label: r.body.trim(), icon: 'globe' } : null;
})();
```

### Public IP location
Allowed hosts: `ipinfo.io`. Refresh: 10 minutes. City and country of your public address: handy to check at a glance that a VPN is up.

```javascript
(function() {
    let r = $http.get('https://ipinfo.io/json')
    if (!r || !r.ok) {
        return null;
    }
    let info = JSON.parse(r.body)
    let place = [info.city, info.country].filter(Boolean).join(', ')
    return {
        label: place || info.ip || '',
        icon: 'mappin.and.ellipse'
    }
})();
```

### Weather
Allowed hosts: `wttr.in`. Refresh: 10 minutes. The temperature, with an icon that follows the sky. Leave `city` empty to let [wttr.in](https://wttr.in/:help) locate your public IP address.

```javascript
(function() {
    // Empty city: wttr.in locates the public IP of the device
    let city = 'Paris'
    let r = $http.get('https://wttr.in/' + encodeURIComponent(city) + '?format=%C|%t')
    if (!r || !r.ok || r.body.indexOf('|') < 0) {
        return null;
    }
    let parts = r.body.trim().split('|')
    let condition = parts[0].trim().toLowerCase()
    let temperature = parts[1].replace('+', '')

    let icon = 'cloud'
    if (condition.includes('thunder')) icon = 'cloud.bolt.rain'
    else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('ice')) icon = 'cloud.snow'
    else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) icon = 'cloud.rain'
    else if (condition.includes('fog') || condition.includes('mist')) icon = 'cloud.fog'
    else if (condition.includes('partly')) icon = 'cloud.sun'
    else if (condition.includes('sunny') || condition.includes('clear')) icon = 'sun.max'

    return { label: temperature, icon }
})();
```

### Service status page
Allowed hosts: `www.githubstatus.com`. Refresh: 5 minutes. Hidden while everything is fine, orange for a minor incident, red otherwise. Works with any [Statuspage](https://www.atlassian.com/software/statuspage) site: replace the host, the path `/api/v2/status.json` is the same.

```javascript
(function() {
    let r = $http.get('https://www.githubstatus.com/api/v2/status.json')
    if (!r || !r.ok) {
        return null;
    }
    let status = JSON.parse(r.body).status
    if (status.indicator === 'none') {
        return null; // All systems operational: nothing to show
    }
    return {
        label: 'GitHub: ' + status.description,
        icon: 'exclamationmark.icloud',
        tint: status.indicator === 'minor' ? 'warning' : 'error'
    }
})();
```

### Website health check
Allowed hosts: the host of your site. Refresh: 1 minute. Shows the response time, turns orange when it is slow and red when the site answers with an error or not at all. With *Graph* enabled, the sparkline follows the response time.

```javascript
(function() {
    let start = Date.now()
    let r = $http.get('https://example.com/', { timeout: 5 })
    let ms = Date.now() - start
    if (!r) {
        return { label: 'down', icon: 'xmark.icloud', tint: 'error' };
    }
    return {
        label: ms + ' ms',
        icon: r.ok ? 'checkmark.icloud' : 'exclamationmark.icloud',
        tint: r.ok ? (ms > 1500 ? 'warning' : 'normal') : 'error',
        value: ms
    }
})();
```

### Latest release of a GitHub repository
Allowed hosts: `api.github.com`. Refresh: 10 minutes (GitHub allows 60 anonymous requests per hour and per IP address). Shows the latest tag, with a badge when a release came out since the session started. When the request fails, the last known version stays displayed thanks to `$vars`.

```javascript
(function() {
    let repo = 'mobile-shell/mosh'
    let r = $http.get('https://api.github.com/repos/' + repo + '/releases/latest', {
        headers: { Accept: 'application/vnd.github+json' }
    })
    if (!r || !r.ok) {
        // Rate limited or offline: keep showing the last known version
        let known = $vars.get('RELEASE', '')
        return known ? { label: known, icon: 'shippingbox' } : null;
    }
    let tag = JSON.parse(r.body).tag_name
    let first = $vars.get('RELEASE_FIRST', tag)
    $vars.set('RELEASE_FIRST', first)
    $vars.set('RELEASE', tag)
    return {
        label: tag,
        icon: 'shippingbox',
        // A release came out since the session started
        badge: tag !== first ? 'new' : '',
        tint: tag !== first ? 'success' : 'normal'
    }
})();
```

### Bitcoin price
Allowed hosts: `api.coinbase.com`. Refresh: 1 minute. Enable *Graph* to get the trend next to the price: `value` carries the exact number, the label a rounded one.

```javascript
(function() {
    let r = $http.get('https://api.coinbase.com/v2/prices/BTC-USD/spot')
    if (!r || !r.ok) {
        return null;
    }
    let price = parseFloat(JSON.parse(r.body).data.amount)
    return {
        label: '$' + Math.round(price).toLocaleString('en-US'),
        icon: 'bitcoinsign.circle',
        value: price
    }
})();
```

### Home Assistant sensor
Allowed hosts: the address of your instance (`192.168.1.20` here, the port does not matter). Refresh: 30 seconds. Reads one entity through the [Home Assistant REST API](https://developers.home-assistant.io/docs/api/rest/) with a long-lived access token (your profile → Security). Plain `http` is fine on your local network; an instance with a self-signed certificate is not supported.

```javascript
(function() {
    let base = 'http://192.168.1.20:8123'
    let token = 'YOUR_LONG_LIVED_ACCESS_TOKEN'
    let r = $http.get(base + '/api/states/sensor.living_room_temperature', {
        headers: { Authorization: 'Bearer ' + token }
    })
    if (!r || !r.ok) {
        return null;
    }
    let sensor = JSON.parse(r.body)
    let unit = (sensor.attributes && sensor.attributes.unit_of_measurement) || ''
    return {
        label: sensor.state + ' ' + unit,
        icon: 'thermometer.medium',
        value: parseFloat(sensor.state)
    }
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
