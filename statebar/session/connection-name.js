(function() {
    return {
        label: $vars.get('WEBSSH_CONNECTION_NAME', $vars.get('WEBSSH_CONNECTION_HOST', '')),
        icon: $vars.get('WEBSSH_CONNECTION_ICON', 'server.rack')
    };
})();
