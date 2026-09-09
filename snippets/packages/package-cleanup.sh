if command -v apt >/dev/null 2>&1; then
    apt autoremove
elif command -v dnf >/dev/null 2>&1; then
    dnf autoremove && dnf clean all
elif command -v apk >/dev/null 2>&1; then
    apk cache clean
elif command -v pacman >/dev/null 2>&1; then
    pacman -Sc
elif command -v zypper >/dev/null 2>&1; then
    zypper clean --all
elif command -v brew >/dev/null 2>&1; then
    brew cleanup && brew autoremove
else
    echo "No supported package manager found" >&2
fi
