# Refresh the index, then list pending upgrades - whatever the package manager
if command -v apt >/dev/null 2>&1; then
    apt update && apt list --upgradable
elif command -v dnf >/dev/null 2>&1; then
    dnf check-update
elif command -v apk >/dev/null 2>&1; then
    apk update && apk list -u
elif command -v checkupdates >/dev/null 2>&1; then
    checkupdates
elif command -v pacman >/dev/null 2>&1; then
    pacman -Qu
elif command -v zypper >/dev/null 2>&1; then
    zypper refresh && zypper list-updates
elif command -v brew >/dev/null 2>&1; then
    brew update && brew outdated
else
    echo "No supported package manager found" >&2
fi
