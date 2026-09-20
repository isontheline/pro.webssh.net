(function() {
    let date = $ssh.exec("timeout -k 1s 1s date '+%a %d %b %H:%M %Z'")
    return date ? { label: date.trim(), icon: 'calendar' } : null;
})();
