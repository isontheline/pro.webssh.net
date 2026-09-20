(function() {
    let raw = $ssh.exec('timeout -k 1s 1s who')
    if (raw === null) {
        return null;
    }
    let sessions = raw.split('\n').filter(line => line.trim() !== '')
    let count = sessions.length
    return {
        label: '',
        icon: count > 1 ? 'person.2' : 'person',
        badge: count,
        tint: count > 1 ? 'warning' : 'normal', // someone else is logged in
        detail: sessions.join('\n') // tap the item: who, from where, since when
    };
})();
