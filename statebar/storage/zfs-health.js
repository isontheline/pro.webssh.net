(function() {
    let raw = $ssh.exec('timeout -k 2s 2s zpool status -x 2>/dev/null')
    if (!raw) {
        return null; // no ZFS here
    }
    let healthy = raw.indexOf('all pools are healthy') >= 0
    return {
        label: healthy ? 'ZFS' : 'ZFS degraded',
        icon: healthy ? 'checkmark.shield' : 'exclamationmark.shield',
        tint: healthy ? 'success' : 'error'
    };
})();
