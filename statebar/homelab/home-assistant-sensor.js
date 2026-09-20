(function() {
    // Long-lived access token: Home Assistant → your profile → Security
    let base = '{{{ HOME_ASSISTANT_URL : "http://homeassistant.local:8123" }}}'.replace(/\/+$/, '')
    let r = $http.get(base + '/api/states/{{{ ENTITY : sensor.living_room_temperature }}}', {
        headers: { Authorization: 'Bearer {{{ TOKEN | secret }}}' }
    })
    if (!r || !r.ok) {
        return null;
    }
    let sensor = JSON.parse(r.body)
    let unit = (sensor.attributes && sensor.attributes.unit_of_measurement) || ''
    let number = parseFloat(sensor.state)
    return {
        label: (sensor.state + ' ' + unit).trim(),
        icon: 'house',
        tint: sensor.state === 'unavailable' ? 'warning' : 'normal',
        value: isNaN(number) ? undefined : number
    };
})();
