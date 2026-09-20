(function() {
    let uptime = $ssh.exec('timeout -k 1s 1s uptime -p')
    if (!uptime) {
        return null;
    }
    return {
        label: uptime.trim().replace(/^up /, ''),
        icon: 'power'
    };
})();
