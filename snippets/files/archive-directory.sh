tar --exclude-vcs -czvf "../$(basename "$PWD")-$(date +%Y%m%d-%H%M%S).tar.gz" .
