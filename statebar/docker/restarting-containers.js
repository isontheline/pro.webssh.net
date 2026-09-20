(function() {
    let raw = $ssh.exec("timeout -k 2s 2s docker ps --filter status=restarting -q 2>/dev/null | wc -l")
    if (raw === null) {
        return null;
    }
    let count = parseInt(raw, 10) || 0
    if (count === 0) {
        return null; // hidden unless a container is stuck in a restart loop
    }
    return {
        label: 'restarting',
        icon: 'arrow.triangle.2.circlepath',
        badge: count,
        tint: 'warning'
    };
})();
