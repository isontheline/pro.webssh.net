(function() {
    // df can hang on a stalled mount, hence the 1 second limit
    let raw = $ssh.exec("timeout -k 1s 1s df -P '{{{ MOUNT : / }}}' | awk 'NR==2 {print $5}'")
    let percent = parseInt(raw, 10)
    if (isNaN(percent)) {
        return null;
    }
    return {
        label: percent + ' %',
        icon: 'internaldrive',
        progress: percent / 100, // replaces the icon with a ring
        tint: percent >= 90 ? 'error' : (percent >= 75 ? 'warning' : 'normal'),
        value: percent
    };
})();
