(function() {
    // City and country of your public address: a quick way to check a VPN
    let r = $http.get('https://ipinfo.io/json')
    if (!r || !r.ok) {
        return null;
    }
    let info = JSON.parse(r.body)
    let place = [info.city, info.country].filter(Boolean).join(', ')
    return {
        label: place || info.ip || '',
        icon: 'mappin.and.ellipse'
    };
})();
