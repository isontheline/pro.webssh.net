(function() {
    let user = $vars.get('WEBSSH_CONNECTION_USERNAME', '')
    let host = $vars.get('WEBSSH_CONNECTION_HOST', '')
    if (!host) {
        return null;
    }
    return {
        label: user ? user + '@' + host : host,
        icon: user === 'root' ? 'person.badge.key' : 'person',
        tint: user === 'root' ? 'warning' : 'normal'
    };
})();
