(function() {
    // Proxmox VE node, run as root: running VMs and containers
    let raw = $ssh.exec("timeout -k 3s 3s sh -c 'echo $(qm list 2>/dev/null | grep -c \" running \") $(pct list 2>/dev/null | grep -c \" running \")'")
    if (!raw) {
        return null;
    }
    let parts = raw.trim().split(' ').map(Number)
    if (parts.length < 2 || isNaN(parts[0])) {
        return null;
    }
    return {
        label: 'VM ' + parts[0] + ' · CT ' + parts[1],
        icon: 'square.stack.3d.up'
    };
})();
