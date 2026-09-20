(function() {
    // The public address of the SERVER (see Web APIs for the one of your device)
    let ip = $ssh.exec('timeout -k 3s 3s curl -fsS -m 2 https://api.ipify.org')
    return ip ? { label: ip.trim(), icon: 'globe' } : null;
})();
