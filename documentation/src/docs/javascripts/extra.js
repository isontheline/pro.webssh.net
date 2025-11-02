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

function loadJavascriptFile(scriptURL, callback) {
    if (window.alreadyLoadedScripts == undefined) {
        window.alreadyLoadedScripts = {};
    }

    if (callback == undefined) {
        callback = function () { };
    }

    if (window.alreadyLoadedScripts[scriptURL] != undefined) {
        if (callback != undefined) {
            callback();
        }

        return;
    }

    window.alreadyLoadedScripts[scriptURL] = true;

    loadJavascriptFileNow(scriptURL, callback);
}

function appendBuildDateParam(url) {
    // YearMonthDay :
    const param = '_=' + new Date().getFullYear().toString() +
        ('0' + (new Date().getMonth() + 1)).slice(-2) +
        ('0' + new Date().getDate()).slice(-2);
    return url + (url.includes('?') ? '&' : '?') + param;
}

function loadJavascriptFileNow(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) {  //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function () {
            callback();
        };
    }

    const buildDatedUrl = appendBuildDateParam(url);
    script.src = buildDatedUrl;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function loadBulkResources(arrayOfResourcesURLs, originalCallback) {
    if (originalCallback == undefined) {
        originalCallback = function () { };
    }

    if (arrayOfResourcesURLs.length == 0) {
        setTimeout(function () {
            originalCallback();
        }, 300);

        return;
    }

    var resourceURL = arrayOfResourcesURLs.shift();

    var callback = function () {
        loadBulkResources(arrayOfResourcesURLs, originalCallback);
    }

    if (resourceURL.indexOf('.css') > 0) {
        loadStylesheetFile(resourceURL, callback);
    } else {
        loadJavascriptFile(resourceURL, callback);
    }
}

function loadStylesheetFile(cssURL, callback) {
    if (window.alreadyLoadedCSS == undefined) {
        window.alreadyLoadedCSS = {};
    }

    if (callback == undefined) {
        callback = function () { };
    }

    if (window.alreadyLoadedCSS[cssURL] != undefined) {
        if (callback != undefined) {
            callback();
        }

        return;
    }

    window.alreadyLoadedCSS[cssURL] = true;

    loadStylesheetFileNow(cssURL, callback);
}

function loadStylesheetFileNow(url, callback) {
    const buildDatedUrl = appendBuildDateParam(url);
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', buildDatedUrl);

    document.getElementsByTagName('head')[0].appendChild(link);

    callback();
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
