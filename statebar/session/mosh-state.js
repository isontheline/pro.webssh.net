(function() {
    if (typeof $mosh === 'undefined') {
        return null; // SSH session: nothing to show
    }
    let state = $mosh.state()
    if (state === 'stale') {
        return {
            label: Math.round($mosh.secondsSinceLastContact()) + ' s',
            icon: 'antenna.radiowaves.left.and.right.slash',
            tint: 'warning'
        };
    }
    return {
        label: state,
        icon: state === 'connected' ? 'antenna.radiowaves.left.and.right' : 'pause.circle',
        tint: state === 'closed' ? 'error' : 'normal'
    };
})();
