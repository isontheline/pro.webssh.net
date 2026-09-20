(function() {
    // Empty city: wttr.in locates the public IP address of your device
    let city = '{{{ CITY : Paris }}}'
    let imperial = '{{{ UNITS : metric : imperial }}}' === 'imperial'
    let r = $http.get('https://wttr.in/' + encodeURIComponent(city) + '?format=j1', { timeout: 5 })
    if (!r || !r.ok) {
        return null;
    }
    let data = JSON.parse(r.body)
    let now = data.current_condition && data.current_condition[0]
    if (!now) {
        return null;
    }

    let degrees = imperial ? '°F' : '°C'
    function temp(entry, key) { return entry[key + (imperial ? 'F' : 'C')] + '°' }
    function sky(entry) { return entry.weatherDesc[0].value.trim() }
    function wind(entry) {
        return entry.winddir16Point + ' ' + (imperial ? entry.windspeedMiles + ' mph' : entry.windspeedKmph + ' km/h')
    }

    // Icon of the bar: follows the sky of the moment
    let description = sky(now).toLowerCase()
    let icon = 'cloud'
    if (description.includes('thunder')) icon = 'cloud.bolt.rain'
    else if (description.includes('snow') || description.includes('sleet') || description.includes('ice')) icon = 'cloud.snow'
    else if (description.includes('rain') || description.includes('drizzle') || description.includes('shower')) icon = 'cloud.rain'
    else if (description.includes('fog') || description.includes('mist')) icon = 'cloud.fog'
    else if (description.includes('partly')) icon = 'cloud.sun'
    else if (description.includes('sunny') || description.includes('clear')) icon = 'sun.max'

    // Details (tap the item): now, then today by 3 hours, then the next days
    let area = data.nearest_area && data.nearest_area[0]
    let place = city || (area ? area.areaName[0].value : '')
    if (area && area.country[0].value) {
        place += (place ? ', ' : '') + area.country[0].value
    }
    let lines = [
        place,
        sky(now) + ', feels like ' + temp(now, 'FeelsLike').replace('°', degrees),
        'Humidity ' + now.humidity + ' %   Wind ' + wind(now) + '   UV ' + now.uvIndex
    ]

    let currentHour = new Date().getHours()
    ;(data.weather || []).forEach(function(day, index) {
        let date = new Date(day.date + 'T12:00:00')
        let title = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })
        lines.push('')
        lines.push(title + '   ' + temp(day, 'mintemp') + ' / ' + temp(day, 'maxtemp')
            + (index === 0 ? '   Sun ' + day.astronomy[0].sunrise + ' - ' + day.astronomy[0].sunset : ''))
        day.hourly.forEach(function(slot) {
            let hour = parseInt(slot.time, 10) / 100
            // Today: what is left of the day. Next days: morning, midday, evening.
            if (index === 0 ? hour + 3 <= currentHour : [9, 15, 21].indexOf(hour) < 0) {
                return;
            }
            lines.push('  ' + String(hour).padStart(2, '0') + ':00  '
                + temp(slot, 'temp').padStart(4) + '  '
                + ('rain ' + slot.chanceofrain + ' %').padEnd(11)
                + sky(slot))
        })
    })

    return {
        label: temp(now, 'temp_').replace('°', degrees),
        icon,
        detail: lines.join('\n')
    };
})();
