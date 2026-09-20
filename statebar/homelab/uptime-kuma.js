(function() {
    // Reads a PUBLIC status page of Uptime Kuma (no credentials needed)
    let base = '{{{ UPTIME_KUMA_URL : "http://uptime.local:3001" }}}'.replace(/\/+$/, '')
    let r = $http.get(base + '/api/status-page/heartbeat/{{{ STATUS_PAGE_SLUG : default }}}')
    if (!r || !r.ok) {
        return { label: 'Uptime Kuma', icon: 'waveform.path.ecg', tint: 'warning' };
    }
    let beats = JSON.parse(r.body).heartbeatList || {}
    let monitors = Object.keys(beats)
    // Last heartbeat of each monitor: 0 = down, 1 = up, 2 = pending, 3 = maintenance
    let down = monitors.filter(id => {
        let list = beats[id]
        return list.length > 0 && list[list.length - 1].status === 0
    }).length
    return {
        label: down ? down + ' down' : monitors.length + ' up',
        icon: 'waveform.path.ecg',
        badge: down,
        tint: down ? 'error' : 'success'
    };
})();
