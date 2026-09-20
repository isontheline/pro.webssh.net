(function() {
    let r = $http.get('https://api.github.com/repos/{{{ REPOSITORY : mobile-shell/mosh }}}/releases/latest', {
        headers: { Accept: 'application/vnd.github+json' }
    })
    if (!r || !r.ok) {
        // Rate limited (60 requests per hour) or offline: keep the last known version
        let known = $vars.get('RELEASE', '')
        return known ? { label: known, icon: 'shippingbox' } : null;
    }
    let tag = JSON.parse(r.body).tag_name
    let first = $vars.get('RELEASE_FIRST', tag)
    $vars.set('RELEASE_FIRST', first)
    $vars.set('RELEASE', tag)
    return {
        label: tag,
        icon: 'shippingbox',
        badge: tag !== first ? 'new' : '', // released since the session started
        tint: tag !== first ? 'success' : 'normal'
    };
})();
