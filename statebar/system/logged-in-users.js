(function() {
    let raw = $ssh.exec('timeout -k 1s 1s who | wc -l')
    if (raw === null) {
        return null;
    }
    let count = parseInt(raw, 10) || 0
    return {
        label: '',
        icon: count > 1 ? 'person.2' : 'person',
        badge: count,
        tint: count > 1 ? 'warning' : 'normal' // someone else is logged in
    };
})();
