(function() {
    let raw = $ssh.exec("timeout -k 2s 2s pvecm status 2>/dev/null | awk -F': *' '/^Quorate/ {print $2}'")
    if (!raw) {
        return null; // standalone node: no cluster
    }
    let quorate = raw.trim().toLowerCase() === 'yes'
    return {
        label: quorate ? 'Quorum' : 'No quorum',
        icon: quorate ? 'checkmark.seal' : 'xmark.seal',
        tint: quorate ? 'success' : 'error'
    };
})();
