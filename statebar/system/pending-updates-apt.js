(function() {
    // Reads the local apt cache only: fast, but as fresh as the last "apt update"
    let raw = $ssh.exec('timeout -k 2s 2s apt list --upgradable 2>/dev/null | grep -c upgradable')
    if (raw === null) {
        return null;
    }
    let count = parseInt(raw, 10) || 0
    if (count === 0) {
        return null; // up to date: hidden
    }
    return {
        label: '',
        icon: 'shippingbox',
        badge: count,
        tint: count > 20 ? 'warning' : 'normal'
    };
})();
