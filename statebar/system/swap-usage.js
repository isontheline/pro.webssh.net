(function() {
    // kB: swap total, swap free
    let raw = $ssh.exec("timeout -k 1s 1s awk '/^SwapTotal/ {t=$2} /^SwapFree/ {f=$2} END {printf \"%d %d\", t, f}' /proc/meminfo")
    if (!raw) {
        return null;
    }
    let fields = raw.trim().split(' ').map(Number)
    if (fields.length < 2 || !fields[0]) {
        return null; // no swap configured: hidden
    }
    let total = fields[0], free = Math.min(fields[1], total)
    let used = total - free
    let percent = Math.round(100 * used / total)
    let size = kb => kb >= 1048576 ? (kb / 1048576).toFixed(1) + ' GB' : Math.round(kb / 1024) + ' MB'
    let bytes = kb => kb * 1024
    return {
        label: size(used) + ' / ' + size(total),
        icon: 'externaldrive',
        progress: percent / 100,
        tint: percent >= 80 ? 'error' : (percent >= 50 ? 'warning' : 'normal'),
        value: percent,
        unit: '%',
        // Tap the item: used and free swap
        parts: [
            { label: 'used', value: bytes(used), unit: 'bytes' },
            { label: 'free', value: bytes(free), unit: 'bytes' }
        ]
    };
})();
