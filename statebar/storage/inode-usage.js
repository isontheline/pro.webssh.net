(function() {
    let raw = $ssh.exec("timeout -k 1s 1s df -Pi '{{{ MOUNT : / }}}' | awk 'NR==2 {print $5}'")
    let percent = parseInt(raw, 10)
    if (isNaN(percent) || percent < 50) {
        return null; // only worth showing when inodes start to run out
    }
    return {
        label: 'inodes ' + percent + ' %',
        icon: 'square.stack.3d.up',
        progress: percent / 100,
        tint: percent >= 90 ? 'error' : (percent >= 75 ? 'warning' : 'normal')
    };
})();
