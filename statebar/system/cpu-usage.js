(function() {
    if (!$ssh.isConnected()) {
        return null;
    }

    // First "cpu" line of /proc/stat: user, nice, system, idle, iowait, irq, softirq
    function cpuTimes(stat) {
        let line = stat.split('\n').find(l => l.startsWith('cpu '))
        if (!line) {
            return null;
        }
        let p = line.trim().split(/\s+/).slice(1, 8).map(Number)
        return {
            user: p[0] + p[1],
            system: p[2] + p[5] + p[6],
            iowait: p[4],
            idle: p[3] + p[4],
            total: p.reduce((sum, value) => sum + value, 0)
        };
    }

    let stat = $ssh.exec('timeout -k 1s 1s cat /proc/stat')
    let now = stat ? cpuTimes(stat) : null
    if (!now) {
        return null;
    }
    // Usage over the last interval: previous snapshot kept between two runs
    let before = $vars.get('CPU_STAT', now)
    $vars.set('CPU_STAT', now)

    let elapsed = now.total - before.total
    function percent(key) {
        return elapsed > 0 ? Math.round(100 * (now[key] - before[key]) / elapsed) : 0
    }
    let usage = elapsed > 0 ? Math.round(100 * (elapsed - (now.idle - before.idle)) / elapsed) : 0

    // Which component to show: the total, or one of user / system / I/O wait
    let component = '{{{ COMPONENT : total : user : system : iowait }}}'
    let shown = component === 'total' ? usage : percent(component)
    let suffix = { user: ' us', system: ' sy', iowait: ' wa' }[component] || ''

    let icon = 'gauge.with.dots.needle.0percent'
    if (shown >= 80) icon = 'gauge.with.dots.needle.100percent'
    else if (shown >= 67) icon = 'gauge.with.dots.needle.67percent'
    else if (shown >= 50) icon = 'gauge.with.dots.needle.50percent'
    else if (shown >= 33) icon = 'gauge.with.dots.needle.33percent'

    return {
        label: shown + ' %' + suffix,
        icon,
        tint: shown >= 90 ? 'error' : (shown >= 75 ? 'warning' : 'normal'),
        value: shown,
        unit: '%',
        detail: 'user   ' + percent('user') + ' %\nsystem ' + percent('system') + ' %\niowait ' + percent('iowait') + ' %\ntotal  ' + usage + ' %'
    };
})();
