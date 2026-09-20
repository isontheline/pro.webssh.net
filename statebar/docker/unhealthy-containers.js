(function() {
    let raw = $ssh.exec("timeout -k 2s 2s docker ps --filter health=unhealthy --format '{{.Names}}' 2>/dev/null")
    if (raw === null) {
        return null;
    }
    let names = raw.split('\n').map(name => name.trim()).filter(Boolean)
    if (names.length === 0) {
        return null; // hidden while every container is healthy
    }
    return {
        label: names.length === 1 ? names[0] : 'unhealthy',
        icon: 'cross.case',
        badge: names.length,
        tint: 'error',
        detail: names.join('\n')
    };
})();
