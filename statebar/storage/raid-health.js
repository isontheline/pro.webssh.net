(function() {
    let raw = $ssh.exec('timeout -k 1s 1s cat /proc/mdstat 2>/dev/null')
    if (!raw || raw.indexOf(' : active') < 0) {
        return null; // no Linux software RAID array
    }
    // [UU] every member is up, [U_] one member is missing
    let states = raw.match(/\[[U_]+\]/g) || []
    let degraded = states.filter(state => state.indexOf('_') >= 0).length
    let rebuilding = /recovery|resync/.test(raw)
    return {
        label: degraded ? 'RAID degraded' : (rebuilding ? 'RAID rebuilding' : 'RAID'),
        icon: degraded ? 'exclamationmark.shield' : 'checkmark.shield',
        tint: degraded ? 'error' : (rebuilding ? 'warning' : 'success')
    };
})();
