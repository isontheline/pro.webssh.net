(function() {
    // df can hang on a stalled mount, hence the 1 second limit
    let raw = $ssh.exec("timeout -k 1s 1s df -P '{{{ MOUNT : / }}}' | awk 'NR==2 {print $5}'")
    let percent = parseInt(raw, 10)
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
        detail: all ? all.trim() : undefined
    };
})();
