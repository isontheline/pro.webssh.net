if(navigator.userAgent.indexOf('WebSSH') == 0) {
    var body = document.querySelector('[data-md-color-scheme=preference]');
    body.dataset['mdColorScheme'] = 'slate';
	body.style.setProperty('--md-default-bg-color', 'black');
	body.style.setProperty('--md-admonition-bg-color', 'var(--md-footer-bg-color)');
}