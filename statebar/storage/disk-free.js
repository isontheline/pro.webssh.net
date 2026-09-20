(function() {
    let free = $ssh.exec("timeout -k 1s 1s df -Ph '{{{ MOUNT : / }}}' | awk 'NR==2 {print $4}'")
    if (!free) {
        return null;
    }
    return {
        label: free.trim() + ' free',
        icon: 'internaldrive'
    };
})();
