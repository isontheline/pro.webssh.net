(function() {
    // Instant value of a PromQL expression
    let base = '{{{ PROMETHEUS_URL : "http://prometheus.local:9090" }}}'.replace(/\/+$/, '')
    let query = '{{{ QUERY : "count(up == 0) or vector(0)" }}}'
    let r = $http.get(base + '/api/v1/query?query=' + encodeURIComponent(query))
    if (!r || !r.ok) {
        return null;
    }
    let result = JSON.parse(r.body).data.result
    if (!result || result.length === 0) {
        return null;
    }
    let number = parseFloat(result[0].value[1])
    return {
        label: '{{{ LABEL : targets down }}}: ' + (Math.round(number * 100) / 100),
        icon: 'flame',
        tint: number > 0 ? 'warning' : 'normal',
        value: number
    };
})();
