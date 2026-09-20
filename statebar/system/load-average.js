(function() {
    let load = $ssh.exec("timeout -k 1s 1s cut -d ' ' -f 1-3 /proc/loadavg")
    if (!load) {
        return null;
    }
    return {
        label: load.trim(),
        icon: 'chart.line.uptrend.xyaxis',
        value: parseFloat(load) // 1 minute load, for the sparkline
    };
})();
