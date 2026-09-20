(function() {
    // -C: metadata cache only, no network access from the server
    let raw = $ssh.exec("timeout -k 3s 3s dnf -q -C check-update 2>/dev/null | grep -c '^[[:alnum:]]'")
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
