(function() {
    let start = Date.now()
    let r = $http.get('{{{ URL : "https://example.com/" }}}', { timeout: 5 })
    let ms = Date.now() - start
    if (!r) {
        return { label: 'down', icon: 'xmark.icloud', tint: 'error' };
    }
    return {
        label: r.ok ? ms + ' ms' : 'HTTP ' + r.status,
        icon: r.ok ? 'checkmark.icloud' : 'exclamationmark.icloud',
        tint: r.ok ? (ms > 1500 ? 'warning' : 'normal') : 'error',
        value: ms, // response time, for the sparkline
        unit: 'ms'
    };
})();
