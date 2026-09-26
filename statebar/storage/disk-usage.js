(function() {
    // df can hang on a stalled mount, hence the 1 second limit
    // kB used, kB available, and the usage percentage of the mount point
    let raw = $ssh.exec("timeout -k 1s 1s df -P '{{{ MOUNT : / }}}' | awk 'NR==2 {print $3, $4, $5}'")
    let fields = (raw || '').trim().split(' ')
    let percent = parseInt(fields[2], 10)
    let bytes = kb => (parseInt(kb, 10) || 0) * 1024
    // Every real file system, for the detail panel (tap the item)
    let all = $ssh.exec("timeout -k 1s 1s df -Ph -x tmpfs -x devtmpfs -x overlay -x squashfs 2>/dev/null")
    if (isNaN(percent)) {
        return null;
    }
    return {
        label: percent + ' %',
        icon: 'internaldrive',
        progress: percent / 100, // replaces the icon with a ring
        tint: percent >= 90 ? 'error' : (percent >= 75 ? 'warning' : 'normal'),
        value: percent,
        unit: '%',
        parts: [{ label: 'used', value: bytes(fields[0]), unit: 'bytes' }, { label: 'free', value: bytes(fields[1]), unit: 'bytes' }],
        detail: all ? all.trim() : undefined
    };
})();
