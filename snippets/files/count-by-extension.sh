find . -type f | sed -n 's/.*\.\([^./]*\)$/\1/p' | sort | uniq -c | sort -rn | head -n 20
