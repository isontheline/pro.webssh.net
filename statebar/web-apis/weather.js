(function() {
    // Empty city: wttr.in locates the public IP address of your device
    let city = '{{{ CITY : Paris }}}'
    let units = '{{{ UNITS : metric : imperial }}}' === 'imperial' ? 'u' : 'm'
    let r = $http.get('https://wttr.in/' + encodeURIComponent(city) + '?' + units + '&format=%C|%t')
    if (!r || !r.ok || r.body.indexOf('|') < 0) {
        return null;
    }
    let parts = r.body.trim().split('|')
    let sky = parts[0].trim().toLowerCase()

    let icon = 'cloud'
    if (sky.includes('thunder')) icon = 'cloud.bolt.rain'
    else if (sky.includes('snow') || sky.includes('sleet') || sky.includes('ice')) icon = 'cloud.snow'
    else if (sky.includes('rain') || sky.includes('drizzle') || sky.includes('shower')) icon = 'cloud.rain'
    else if (sky.includes('fog') || sky.includes('mist')) icon = 'cloud.fog'
    else if (sky.includes('partly')) icon = 'cloud.sun'
    else if (sky.includes('sunny') || sky.includes('clear')) icon = 'sun.max'

    return { label: parts[1].replace('+', ''), icon };
})();
