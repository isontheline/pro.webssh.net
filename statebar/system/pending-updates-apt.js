(function() {
    // Reads the local apt cache only: fast, but as fresh as the last "apt update"
    let raw = $ssh.exec("timeout -k 2s 2s apt list --upgradable 2>/dev/null | grep upgradable | cut -d/ -f1")
    if (raw === null) {
        return null;
    }
    let packages = raw.split('\n').map(name => name.trim()).filter(Boolean)
    let count = packages.length
    if (count === 0) {
        return null; // up to date: hidden
    }
    return {
        label: '',
        icon: 'shippingbox',
        badge: count,
        tint: count > 20 ? 'warning' : 'normal',
        detail: packages.join('\n') // tap the item to see the list
    };
})();
