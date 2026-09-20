(function() {
    // Any Atlassian Statuspage site: GitHub, Cloudflare, DigitalOcean, Discord…
    let page = '{{{ STATUS_PAGE : "https://www.githubstatus.com" }}}'.replace(/\/+$/, '')
    let r = $http.get(page + '/api/v2/status.json')
    if (!r || !r.ok) {
        return null;
    }
    let data = JSON.parse(r.body)
    if (data.status.indicator === 'none') {
        return null; // all systems operational: hidden
    }
    return {
        label: data.page.name + ': ' + data.status.description,
        icon: 'exclamationmark.icloud',
        tint: data.status.indicator === 'minor' ? 'warning' : 'error'
    };
})();
