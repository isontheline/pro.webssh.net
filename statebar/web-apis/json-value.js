(function() {
    // Shows one field of any JSON endpoint. FIELD is a dotted path: "data.items.0.name"
    let r = $http.get('{{{ URL : "https://api.coinbase.com/v2/time" }}}', { headers: { Accept: 'application/json' } })
    if (!r || !r.ok) {
        return null;
    }
    let value = JSON.parse(r.body)
    let path = '{{{ FIELD : data.iso }}}'.split('.').filter(Boolean)
    for (let i = 0; i < path.length && value !== null && value !== undefined; i++) {
        value = value[path[i]]
    }
    if (value === null || value === undefined || typeof value === 'object') {
        return null;
    }
    return {
        label: String(value),
        icon: 'curlybraces',
        value: typeof value === 'number' ? value : undefined
    };
})();
