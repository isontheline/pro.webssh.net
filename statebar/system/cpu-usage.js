(function() {
    if (!$ssh.isConnected()) {
        return null;
    }

    // First "cpu" line of /proc/stat: total time and idle time (idle + iowait)
    function cpuTimes(stat) {
        let line = stat.split('\n').find(l => l.startsWith('cpu '))
        if (!line) {
            return null;
        }
        let parts = line.trim().split(/\s+/).slice(1, 8).map(Number)
        return { total: parts.reduce((sum, value) => sum + value, 0), idle: parts[3] + parts[4] };
    }

    let stat = $ssh.exec('timeout -k 1s 1s cat /proc/stat')
    let now = stat ? cpuTimes(stat) : null
    if (!now) {
        return null;
    }
    // Usage over the last interval: previous snapshot kept between two runs
    let before = $vars.get('CPU_STAT', now)
    $vars.set('CPU_STAT', now)

    let total = now.total - before.total
    let usage = total > 0 ? Math.round(100 * (total - (now.idle - before.idle)) / total) : 0

    let icon = 'gauge.with.dots.needle.0percent'
    if (usage >= 80) icon = 'gauge.with.dots.needle.100percent'
    else if (usage >= 67) icon = 'gauge.with.dots.needle.67percent'
    else if (usage >= 50) icon = 'gauge.with.dots.needle.50percent'
    else if (usage >= 33) icon = 'gauge.with.dots.needle.33percent'

    return {
        label: usage + ' %',
        icon,
        tint: usage >= 90 ? 'error' : (usage >= 75 ? 'warning' : 'normal'),
        value: usage
    };
})();
