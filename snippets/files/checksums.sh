# SHA-256 of every file here, GNU coreutils or macOS/perl shasum
if command -v sha256sum >/dev/null 2>&1; then
    find . -maxdepth 1 -type f -exec sha256sum {} +
else
    find . -maxdepth 1 -type f -exec shasum -a 256 {} +
fi
