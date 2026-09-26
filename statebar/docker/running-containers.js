(function() {
    // Every container with its state: running, exited, paused, restarting…
    let raw = $ssh.exec("timeout -k 2s 2s docker ps -a --format '{{.State}}' 2>/dev/null")
    if (raw === null) {
        return null;
    }
    let states = raw.split('\n').map(s => s.trim()).filter(Boolean)
    let count = states.filter(s => s === 'running').length
    // Tap the item: how the containers are split by state
    let byState = {}
    states.forEach(s => byState[s] = (byState[s] || 0) + 1)
    return {
        label: count + ' running',
        icon: 'shippingbox',
        value: count,
        parts: Object.keys(byState).map(s => ({ label: s, value: byState[s] }))
    };
})();
