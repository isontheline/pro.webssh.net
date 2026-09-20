(function() {
    let raw = $ssh.exec("timeout -k 1s 1s awk '/^MemTotal/ {t=$2} /^MemAvailable/ {a=$2} END {printf \"%d %d\", t-a, t}' /proc/meminfo")
    if (!raw) {
        return null;
    }
    let parts = raw.trim().split(' ').map(Number)
    if (parts.length < 2 || !parts[1]) {
        return null;
    }
    let percent = Math.round(100 * parts[0] / parts[1])
    return {
        label: (parts[0] / 1048576).toFixed(1) + ' / ' + (parts[1] / 1048576).toFixed(1) + ' GB',
        icon: 'memorychip',
        progress: percent / 100,
        tint: percent >= 90 ? 'error' : (percent >= 75 ? 'warning' : 'normal'),
        value: percent,
        unit: '%'
    };
})();
