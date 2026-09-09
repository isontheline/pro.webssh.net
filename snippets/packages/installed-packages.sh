# Installed packages - whatever the package manager
if command -v apt >/dev/null 2>&1; then
    apt list --installed
elif command -v dnf >/dev/null 2>&1; then
    dnf list --installed
elif command -v apk >/dev/null 2>&1; then
    apk list -I
elif command -v pacman >/dev/null 2>&1; then
    pacman -Qe
elif command -v zypper >/dev/null 2>&1; then
    zypper search -i
elif command -v brew >/dev/null 2>&1; then
    brew list --versions
else
    echo "No supported package manager found" >&2
fi
