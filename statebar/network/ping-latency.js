(function() {
    // Latency measured FROM the server
    let raw = $ssh.exec("timeout -k 2s 2s ping -c 1 -W 1 '{{{ TARGET : 1.1.1.1 }}}' | grep -o 'time=[0-9.]*'")
    if (raw === null) {
        return null;
    }
    let ms = parseFloat(raw.replace('time=', ''))
    if (isNaN(ms)) {
        return { label: 'no reply', icon: 'wifi.exclamationmark', tint: 'error' };
    }
    return {
        label: Math.round(ms) + ' ms',
        icon: 'wifi',
        tint: ms > 150 ? 'warning' : 'normal',
        value: ms,
        unit: 'ms'
    };
})();
