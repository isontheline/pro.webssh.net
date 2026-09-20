(function() {
    // Bytes received / sent by the interface of the default route
    let raw = $ssh.exec("timeout -k 1s 1s sh -c 'i=$(ip route show default | awk \"{print \\$5; exit}\"); awk -v i=\"$i:\" \"\\$1==i {print \\$2, \\$10}\" /proc/net/dev'")
    if (!raw) {
        return null;
    }
    let parts = raw.trim().split(' ').map(Number)
    if (parts.length < 2 || isNaN(parts[0])) {
        return null;
    }
    let now = { rx: parts[0], tx: parts[1], at: Date.now() }
    let before = $vars.get('NET', now)
    $vars.set('NET', now)

    let seconds = (now.at - before.at) / 1000
    if (seconds <= 0) {
        return { label: '…', icon: 'arrow.up.arrow.down' };
    }
    function rate(bytes) {
        let perSecond = Math.max(0, bytes) / seconds
        if (perSecond >= 1000000) return (perSecond / 1000000).toFixed(1) + ' MB/s'
        return Math.round(perSecond / 1000) + ' kB/s'
    }
    return {
        label: '↓ ' + rate(now.rx - before.rx) + '  ↑ ' + rate(now.tx - before.tx),
        icon: 'arrow.up.arrow.down',
        value: Math.max(0, now.rx - before.rx) / seconds, // download rate, for the graph
        unit: 'bytes/s'
    };
})();
