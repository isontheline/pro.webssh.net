(function() {
    let raw = $ssh.exec("timeout -k 2s 2s systemctl --failed --no-legend --plain 2>/dev/null | awk '{print $1}'")
    if (raw === null) {
        return null;
    }
    let units = raw.split('\n').map(name => name.trim()).filter(Boolean)
    let count = units.length
    if (count === 0) {
        return null; // hidden while every unit is fine
    }
    return {
        label: 'failed',
        icon: 'exclamationmark.triangle',
        badge: count,
        tint: 'error',
        detail: units.join('\n') // tap the item to see which ones
    };
})();
