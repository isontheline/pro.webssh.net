# Recently installed or upgraded packages
if [ -r /var/log/dpkg.log ]; then
    grep -E " (install|upgrade) " /var/log/dpkg.log | tail -n 20
elif command -v dnf >/dev/null 2>&1; then
    dnf history
elif [ -r /var/log/pacman.log ]; then
    grep -E "installed|upgraded" /var/log/pacman.log | tail -n 20
elif command -v rpm >/dev/null 2>&1; then
    rpm -qa --last | head -n 20
else
    echo "No package log found" >&2
fi
