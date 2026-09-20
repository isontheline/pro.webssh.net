(function() {
    // No remote command: never blocks, works on SSH and mosh
    let connected = $ssh.isConnected()
    return {
        label: $vars.get('WEBSSH_CONNECTION_NAME', ''),
        icon: connected ? 'cable.connector' : 'cable.connector.slash',
        tint: connected ? 'normal' : 'error'
    };
})();
