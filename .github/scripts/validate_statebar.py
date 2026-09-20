#!/usr/bin/env python3
"""Validates the State Bar library (statebar/): manifests, item scripts, index.

Run from the repository root:  python3 .github/scripts/validate_statebar.py
Writes to $RENDERED_DIR (default: a temp folder) one copy of every script with
its {{{ VARIABLE }}} placeholders replaced by their default value, so that the
workflow can run `node --check` on real JavaScript.

Mirrors the app (WebSSH_Native): StateBarLibraryModels.swift (manifest),
SnippetTemplate.swift (placeholders), StateBarHTTPBridge.swift (hosts).
"""
import json, os, re, sys, tempfile

ROOT = "statebar"
MAX_SIZE = 8 * 1024
SESSION_VALUES = {"ssh", "mosh"}
OS_VALUES = {"linux", "macos", "windows", "freebsd", "openbsd"}
GRAPH_VALUES = {"off", "sparkline"}
INDEX_MARKERS = SESSION_VALUES | OS_VALUES | {"http"}
PACKAGE_MANAGERS = {"apt", "dnf", "apk", "pacman", "zypper", "brew", "pkg"}
NETWORK_MIN_INTERVAL = 10
USERNAME = re.compile(r"[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$")
# SF Symbols names; existence can't be checked here, the app falls back to a default icon.
SF_SYMBOL = re.compile(r"[a-z0-9]+(?:\.[a-z0-9]+)*$")
VARIABLE = re.compile(r"\{\{\{(.*?)\}\}\}")
VARIABLE_NAME = re.compile(r"[A-Za-z_][A-Za-z0-9_]*$")
VARIABLE_MODIFIERS = {"secret"}
LITERAL_URL = re.compile(r"""https?://([A-Za-z0-9.-]+\.[A-Za-z]{2,}|\d{1,3}(?:\.\d{1,3}){3})""")
SSH_EXEC_LITERAL = re.compile(r"""\$ssh\.exec\(\s*(['"`])(.*?)\1""", re.S)
FORBIDDEN = [(re.compile(r"\beval\s*\("), "eval()"), (re.compile(r"\bFunction\s*\("), "Function()")]

errors, warnings = [], []
rendered_dir = os.environ.get("RENDERED_DIR") or tempfile.mkdtemp(prefix="rendered-statebar-")


def parse_variable(body):
    """Mirrors SnippetTemplate.parseBody. Returns (name, [values], secret) or None."""
    parts, modifiers, current = [], [], ""
    in_quotes = in_modifiers = False
    for ch in body:
        if ch == '"':
            in_quotes = not in_quotes
            current += ch
        elif in_quotes:
            current += ch
        elif ch == "|":
            (modifiers if in_modifiers else parts).append(current)
            current, in_modifiers = "", True
        elif ch == ":" and not in_modifiers:
            parts.append(current)
            current = ""
        else:
            current += ch
    if in_quotes:
        return None
    (modifiers if in_modifiers else parts).append(current)
    name = parts[0].strip()
    if not VARIABLE_NAME.match(name):
        return None
    if any(m.strip().lower() not in VARIABLE_MODIFIERS for m in modifiers):
        return None

    def unquote(p):
        p = p.strip()
        return p[1:-1] if len(p) >= 2 and p[0] == p[-1] == '"' else p

    return name, [unquote(p) for p in parts[1:]], bool(modifiers)


def variables_of(scope, text):
    """name -> default value, for every well-formed placeholder of `text`."""
    found = {}
    for match in VARIABLE.finditer(text):
        parsed = parse_variable(match.group(1))
        if parsed is None:
            errors.append(f"{scope}: malformed variable {match.group(0)} (see statebar/README.md)")
            continue
        name, values, _ = parsed
        if any(v.startswith("//") for v in values):
            errors.append(f"{scope}: {match.group(0)} is split at the ':' of a URL, wrap the default in double quotes")
        found.setdefault(name, values[0] if values else "")
    return found


def render(text, defaults):
    def substitute(match):
        parsed = parse_variable(match.group(1))
        if parsed is None:
            return match.group(0)
        value = defaults.get(parsed[0], "")
        return value.replace("\\", "\\\\").replace("'", "\\'").replace('"', '\\"')
    return VARIABLE.sub(substitute, text)


def host_of(value):
    """Same reduction as StateBarAllowedHosts.normalize in the app."""
    host = value.strip().lower()
    if "://" in host:
        host = host.split("://", 1)[1]
    host = re.split(r"[/?#]", host, maxsplit=1)[0]
    if "@" in host:
        host = host.rsplit("@", 1)[1]
    if host.count(":") == 1:
        host = host.split(":", 1)[0]
    return host


def host_allowed(host, patterns):
    for pattern in patterns:
        if pattern.startswith("*."):
            domain = pattern[2:]
            if host == domain or host.endswith("." + domain):
                return True
        elif host == pattern:
            return True
    return False


def check_entry(scope, meta, script):
    if not isinstance(meta, dict):
        errors.append(f"{scope}: manifest entry must be an object")
        return
    known = {"name", "summary", "icon", "session", "os", "interval", "graph", "hosts", "packages", "maintainers"}
    for key in meta:
        if key not in known:
            errors.append(f"{scope}: unknown key '{key}'")
    for key in ("name", "summary"):
        if not isinstance(meta.get(key), str) or not meta[key].strip():
            errors.append(f"{scope}: '{key}' is required (non-empty string)")
    icon = meta.get("icon")
    if not isinstance(icon, str) or not SF_SYMBOL.match(icon):
        errors.append(f"{scope}: 'icon' must be an SF Symbols name")
    session = meta.get("session")
    if not isinstance(session, list) or not session or any(s not in SESSION_VALUES for s in session):
        errors.append(f"{scope}: 'session' must be a non-empty list among {sorted(SESSION_VALUES)}")
    if "os" in meta and (not isinstance(meta["os"], list) or any(o not in OS_VALUES for o in meta["os"])):
        errors.append(f"{scope}: 'os' values must be among {sorted(OS_VALUES)}")
    if "graph" in meta and meta["graph"] not in GRAPH_VALUES:
        errors.append(f"{scope}: 'graph' must be one of {sorted(GRAPH_VALUES)}")
    hosts = meta.get("hosts", [])
    if not isinstance(hosts, list) or any(not isinstance(h, str) or not h.strip() for h in hosts):
        errors.append(f"{scope}: 'hosts' must be a list of strings")
        hosts = []
    interval = meta.get("interval")
    if interval is not None and (not isinstance(interval, int) or isinstance(interval, bool) or not 1 <= interval <= 600):
        errors.append(f"{scope}: 'interval' must be an integer from 1 to 600")
    elif hosts and (interval is None or interval < NETWORK_MIN_INTERVAL):
        errors.append(f"{scope}: an item with 'hosts' needs an 'interval' of at least {NETWORK_MIN_INTERVAL} seconds")
    packages = meta.get("packages", {})
    if not isinstance(packages, dict) or any(m not in PACKAGE_MANAGERS for m in packages):
        errors.append(f"{scope}: 'packages' must map a manager among {sorted(PACKAGE_MANAGERS)} to a package name")
    maintainers = meta.get("maintainers")
    if not isinstance(maintainers, list) or not maintainers or any(not isinstance(m, str) or not USERNAME.match(m) for m in maintainers):
        errors.append(f"{scope}: 'maintainers' must be a non-empty list of GitHub usernames")

    # --- script
    defaults = variables_of(scope, script)
    host_defaults = variables_of(scope + " (hosts)", ", ".join(hosts))
    for name in host_defaults:
        if name not in defaults:
            errors.append(f"{scope}: 'hosts' uses {{{{{{ {name} }}}}}} but the script never declares it")

    uses_http = "$http" in script
    if uses_http and not hosts:
        errors.append(f"{scope}: the script uses $http but the manifest declares no 'hosts'")
    if hosts and not uses_http:
        errors.append(f"{scope}: 'hosts' declared but the script never uses $http")
    if "$ssh.exec" in script and isinstance(session, list) and "ssh" not in session:
        errors.append(f"{scope}: the script runs $ssh.exec, 'session' must include \"ssh\"")

    rendered = render(script, defaults)
    patterns = [host_of(render(h, defaults)) for h in hosts]
    if any(not p or p in ("*", "*.") for p in patterns):
        errors.append(f"{scope}: a host resolves to nothing or to a bare wildcard")
    if uses_http:
        for match in LITERAL_URL.finditer(rendered):
            # URLs inside a $ssh.exec command are fetched by the server, not by $http.
            line = rendered[rendered.rfind("\n", 0, match.start()) + 1:match.start()]
            if "$ssh.exec" in line or line.lstrip().startswith("//"):
                continue
            if not host_allowed(match.group(1).lower(), patterns):
                errors.append(f"{scope}: {match.group(0)} is not covered by 'hosts'")

    for pattern, label in FORBIDDEN:
        if pattern.search(script):
            errors.append(f"{scope}: {label} is not allowed (disabled by the app when Network Access is on)")
    for match in SSH_EXEC_LITERAL.finditer(script):
        if not match.group(2).lstrip().startswith("timeout "):
            warnings.append(f"{scope}: $ssh.exec command not wrapped in `timeout`: {match.group(2)[:60]}")
    if not re.match(r"\s*(?://[^\n]*\n\s*)*\(function\s*\(\)\s*\{", script) or not script.rstrip().endswith("})();"):
        errors.append(f"{scope}: the script must be one immediately invoked function: (function() {{ ... }})();")
    return rendered


collections = sorted(d for d in os.listdir(ROOT) if os.path.isdir(os.path.join(ROOT, d)))
if not collections:
    errors.append(f"{ROOT}: no collection found")

for coll in collections:
    folder = os.path.join(ROOT, coll)
    if not re.match(r"[a-z0-9][a-z0-9-]*$", coll):
        errors.append(f"{coll}: collection folders are lowercase letters, digits and dashes")
    manifest_path = os.path.join(folder, "webssh.json")
    try:
        with open(manifest_path, encoding="utf-8") as handle:
            manifest = json.load(handle)
    except FileNotFoundError:
        errors.append(f"{coll}: missing webssh.json")
        continue
    except (ValueError, UnicodeDecodeError) as exc:
        errors.append(f"{coll}/webssh.json: invalid JSON ({exc})")
        continue
    if manifest.get("version") != 1:
        errors.append(f"{coll}/webssh.json: \"version\" must be 1")
    files = manifest.get("files")
    if not isinstance(files, dict) or not files:
        errors.append(f"{coll}/webssh.json: \"files\" must be a non-empty object")
        continue

    on_disk = {f for f in os.listdir(folder) if f != "webssh.json" and not f.startswith(".")}
    for name in sorted(on_disk - set(files)):
        errors.append(f"{coll}/{name}: not listed in webssh.json (invisible in the app)")

    for name, meta in sorted(files.items()):
        scope = f"{coll}/{name}"
        if not re.match(r"[a-z0-9][a-z0-9-]*\.js$", name):
            errors.append(f"{scope}: item files are lowercase-with-dashes.js")
            continue
        path = os.path.join(folder, name)
        if not os.path.isfile(path):
            errors.append(f"{scope}: listed in webssh.json but missing on disk")
            continue
        raw = open(path, "rb").read()
        if len(raw) > MAX_SIZE:
            errors.append(f"{scope}: {len(raw)} bytes, the limit is {MAX_SIZE}")
        try:
            script = raw.decode("utf-8")
        except UnicodeDecodeError:
            errors.append(f"{scope}: not valid UTF-8")
            continue
        rendered = check_entry(scope, meta, script)
        if rendered is not None:
            target = os.path.join(rendered_dir, coll)
            os.makedirs(target, exist_ok=True)
            with open(os.path.join(target, name), "w", encoding="utf-8") as handle:
                handle.write(rendered)

# --- index.md: every link resolves, every collection is referenced, markers are known
index_path = os.path.join(ROOT, "index.md")
referenced = set()
try:
    index = open(index_path, encoding="utf-8").read()
    index = re.sub(r"<!--.*?-->", "", index, flags=re.S)
    for line in index.splitlines():
        match = re.match(r"\s*-\s*\[([^\]]+)\]\(([^)]+)\)(.*)", line)
        if not match:
            continue
        target = match.group(2).strip().rstrip("/")
        if target.startswith("./"):
            target = target[2:]
        if not re.match(r"[A-Za-z0-9_/-]+$", target):
            continue  # prose link (README.md…), ignored by the app too
        referenced.add(target)
        if target not in collections:
            errors.append(f"index.md: '{match.group(1)}' points to a missing collection '{target}'")
        for marker in re.findall(r"`([^`]+)`", match.group(3)):
            if marker.strip().lower() not in INDEX_MARKERS:
                errors.append(f"index.md: unknown marker `{marker}` on '{match.group(1)}'")
except FileNotFoundError:
    errors.append("statebar/index.md is missing")
for coll in collections:
    if coll not in referenced:
        warnings.append(f"{coll}: not referenced by index.md (unreachable in the app)")

for message in warnings:
    print(f"::warning::{message}")
for message in errors:
    print(f"::error::{message}")
print(f"{len(collections)} collections checked, {len(errors)} error(s), {len(warnings)} warning(s). Rendered scripts: {rendered_dir}")
sys.exit(1 if errors else 0)
