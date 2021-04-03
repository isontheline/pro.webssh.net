if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.setAttribute("data-md-color-scheme","slate");
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if(e.matches) {
        document.body.setAttribute("data-md-color-scheme","slate");
    }
});

if(navigator.userAgent.indexOf('WebSSH') == 0) {
    //document.body.setAttribute("data-md-color-scheme","slate");
    var body = document.querySelector('[data-md-color-scheme=slate]');
	body.style.setProperty('--md-default-bg-color', 'black');
	body.style.setProperty('--md-admonition-bg-color', 'var(--md-footer-bg-color)');
}