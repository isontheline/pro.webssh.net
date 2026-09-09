if command -v apt >/dev/null 2>&1; then
    apt update && apt upgrade
elif command -v dnf >/dev/null 2>&1; then
    dnf upgrade
elif command -v apk >/dev/null 2>&1; then
    apk update && apk upgrade
elif command -v pacman >/dev/null 2>&1; then
    pacman -Syu
elif command -v zypper >/dev/null 2>&1; then
    zypper update
elif command -v brew >/dev/null 2>&1; then
    brew upgrade
else
    echo "No supported package manager found" >&2
fi
