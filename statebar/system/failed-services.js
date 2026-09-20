(function() {
    let raw = $ssh.exec('timeout -k 2s 2s systemctl --failed --no-legend --plain 2>/dev/null | wc -l')
    if (raw === null) {
        return null;
    }
    let count = parseInt(raw, 10) || 0
    if (count === 0) {
        return null; // hidden while every unit is fine
    }
    return {
        label: 'failed',
        icon: 'exclamationmark.triangle',
        badge: count,
        tint: 'error'
    };
})();
