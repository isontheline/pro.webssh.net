# Which package installed a file - demo on ls, put any path in f
f="$(command -v ls)"
if command -v dpkg >/dev/null 2>&1; then
    dpkg -S "$f"
elif command -v rpm >/dev/null 2>&1; then
    rpm -qf "$f"
elif command -v apk >/dev/null 2>&1; then
    apk info -W "$f"
elif command -v pacman >/dev/null 2>&1; then
    pacman -Qo "$f"
else
    echo "No supported package manager found" >&2
fi
