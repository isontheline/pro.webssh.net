(function() {
    // The public address of YOUR DEVICE (not the one of the server)
    let r = $http.get('https://api.ipify.org')
    return r && r.ok ? { label: r.body.trim(), icon: 'globe' } : null;
})();
