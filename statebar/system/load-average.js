(function() {
    let load = $ssh.exec("timeout -k 1s 1s cut -d ' ' -f 1-3 /proc/loadavg")
    if (!load) {
        return null;
    }
    let values = load.trim().split(' ').map(parseFloat)
    if (values.length < 3 || isNaN(values[0])) {
        return null;
    }
    // Which average to show: all three, or a single one (the graph follows it)
    let period = '{{{ PERIOD : all : 1 min : 5 min : 15 min }}}'
    let index = { '1 min': 0, '5 min': 1, '15 min': 2 }[period]
    return {
        label: index === undefined ? load.trim() : values[index].toFixed(2),
        icon: 'chart.line.uptrend.xyaxis',
        value: values[index === undefined ? 0 : index]
    };
})();
