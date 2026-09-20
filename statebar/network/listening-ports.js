(function() {
    let raw = $ssh.exec('timeout -k 1s 1s ss -Htln | wc -l')
    if (raw === null) {
        return null;
    }
    let count = parseInt(raw, 10) || 0
    // A new listener since the session started is worth a look
    let first = $vars.get('LISTENERS', count)
    $vars.set('LISTENERS', first)
    return {
        label: count + ' ports',
        icon: 'antenna.radiowaves.left.and.right',
        tint: count > first ? 'warning' : 'normal'
    };
})();
