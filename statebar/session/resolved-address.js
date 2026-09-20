(function() {
    // With the passthrough DNS strategy this is the hostname itself
    let address = $vars.get('WEBSSH_CONNECTION_ADDRESS', '')
    return address ? { label: address, icon: 'network' } : null;
})();
