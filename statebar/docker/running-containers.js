(function() {
    let raw = $ssh.exec("timeout -k 2s 2s docker ps -q 2>/dev/null | wc -l")
    if (raw === null) {
        return null;
    }
    let count = parseInt(raw, 10) || 0
    return {
        label: count + ' running',
        icon: 'shippingbox',
        value: count
    };
})();
