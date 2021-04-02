matchMedia("(prefers-color-scheme: dark)").matches&&document.body.setAttribute("data-md-color-scheme","slate");

setTimeout(function() {
    matchMedia("(prefers-color-scheme: dark)").matches&&document.body.setAttribute("data-md-color-scheme","slate");
}, 1);

if(navigator.userAgent.indexOf('WebSSH') == 0) {
    var body = document.querySelector('[data-md-color-scheme=slate]');
	body.style.setProperty('--md-default-bg-color', 'black');
	body.style.setProperty('--md-admonition-bg-color', 'var(--md-footer-bg-color)');
}