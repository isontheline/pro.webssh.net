(function() {
    let raw = $ssh.exec('timeout -k 1s 1s cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null')
    let millidegrees = parseInt(raw, 10)
    if (!millidegrees) {
        return null; // no sensor exposed (many VMs)
    }
    let celsius = Math.round(millidegrees / 1000)
    return {
        label: celsius + ' °C',
        icon: celsius >= 70 ? 'thermometer.high' : 'thermometer.medium',
        tint: celsius >= 85 ? 'error' : (celsius >= 70 ? 'warning' : 'normal'),
        value: celsius,
        unit: '°C'
    };
})();
