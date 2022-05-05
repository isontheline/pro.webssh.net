// https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.setAttribute("data-md-color-scheme", "slate");
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
        document.body.setAttribute("data-md-color-scheme", "slate");
    }
});

if (navigator.userAgent.indexOf('WebSSH') == 0) {
    var body = document.querySelector('[data-md-color-scheme=slate]');

    if (body) {
        if (navigator.userAgent.indexOf('WebSSH iOS') == 0) {
            body.style.setProperty('--md-default-bg-color', 'black');
        } else {
            body.style.setProperty('--md-default-bg-color', '#1F1E1E');
        }

        body.style.setProperty('--md-admonition-bg-color', 'var(--md-footer-bg-color)');
    }
}

const primaryColor = getCookie('PrimaryColor');

if (primaryColor) {
    document.documentElement.style.setProperty('--md-primary-fg-color', primaryColor, 'important');
}

/*let imgAvatar = document.createElement('img');
imgAvatar.src = 'https://avatars.githubusercontent.com/u/44212923?v=4';
imgAvatar.title = 'Like my work? Sponsors are welcome!';
imgAvatar.alt = 'isontheline Sponsors';
imgAvatar.style.height = '100px';
imgAvatar.style.border = 'none';

let likeMyWork = document.createElement('div');
likeMyWork.innerHTML = 'Like my work?';

let linkAvatar = document.createElement('a');
linkAvatar.append(imgAvatar);
linkAvatar.append(likeMyWork);
linkAvatar.href = '/documentation/sponsors/';

let divAvatar = document.createElement('div');
divAvatar.append(linkAvatar);
divAvatar.style.textAlign = 'center';

document.querySelector('div.md-source-file,div.md-source-date').after(divAvatar);*/