(function() {
    // Every ATA/SATA or NVMe device smartctl can see, its path, and the health line smartctl printed for it
    let raw = $ssh.exec("timeout -k 3s 3s sh -c 'smartctl --scan 2>/dev/null | while read -r dev opt type _; do line=$(smartctl -H \"$dev\" \"$opt\" \"$type\" 2>/dev/null | grep \"test result:\"); [ -n \"$line\" ] && printf \"%s: %s\\n\" \"$dev\" \"$line\"; done'")
    if (!raw) {
        return null; // smartctl missing, no permission to the raw device, or nothing scannable
    }
    let lines = raw.trim().split('\n').filter(Boolean)
    if (!lines.length) {
        return null;
    }
    let failed = lines.filter(line => line.indexOf('PASSED') < 0)
    return {
        label: failed.length ? 'SMART failed' : 'SMART',
        icon: failed.length ? 'exclamationmark.shield' : 'checkmark.shield',
        tint: failed.length ? 'error' : 'success',
        // Tap the item: which device(s) and smartctl's own wording for each
        detail: lines.join('\n')
    };
})();
