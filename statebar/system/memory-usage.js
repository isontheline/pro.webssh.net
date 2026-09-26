(function() {
    // kB: total, available, free
    let raw = $ssh.exec("timeout -k 1s 1s awk '/^MemTotal/ {t=$2} /^MemAvailable/ {a=$2} /^MemFree/ {f=$2} END {printf \"%d %d %d\", t, a, f}' /proc/meminfo")
    if (!raw) {
        return null;
    }
    let fields = raw.trim().split(' ').map(Number)
    if (fields.length < 3 || !fields[0]) {
        return null;
    }
    let total = fields[0], used = total - fields[1], free = fields[2]
    // Neither used nor free: buffers and cache, reclaimable
    let cached = Math.max(0, total - used - free)
    let percent = Math.round(100 * used / total)
    let bytes = kb => kb * 1024
    return {
        label: (used / 1048576).toFixed(1) + ' / ' + (total / 1048576).toFixed(1) + ' GB',
        icon: 'memorychip',
        progress: percent / 100,
        tint: percent >= 90 ? 'error' : (percent >= 75 ? 'warning' : 'normal'),
        value: percent,
        unit: '%',
        // Tap the item: how the memory is split
        parts: [
            { label: 'used', value: bytes(used), unit: 'bytes' },
            { label: 'cached', value: bytes(cached), unit: 'bytes' },
            { label: 'free', value: bytes(free), unit: 'bytes' }
        ]
    };
})();
