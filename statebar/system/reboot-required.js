(function() {
    let raw = $ssh.exec('timeout -k 1s 1s test -f /var/run/reboot-required && echo yes')
    if (!raw || raw.trim() !== 'yes') {
        return null; // hidden unless a reboot is pending
    }
    return {
        label: 'Reboot required',
        icon: 'arrow.clockwise.circle',
        tint: 'warning'
    };
})();
