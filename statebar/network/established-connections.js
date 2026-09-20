(function() {
    let raw = $ssh.exec('timeout -k 1s 1s ss -Htn state established | wc -l')
    if (raw === null) {
        return null;
    }
    let count = parseInt(raw, 10) || 0
    return {
        label: count + ' conn.',
        icon: 'point.3.connected.trianglepath.dotted',
        value: count
    };
})();
