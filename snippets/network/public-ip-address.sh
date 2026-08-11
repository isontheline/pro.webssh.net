# Try nslookup first
if command -v nslookup >/dev/null 2>&1; then
    nslookup myip.opendns.com resolver1.opendns.com \
    | awk '/^Address: / {ip=$2} END{if (ip) print ip}'

# Fallback to dig
elif command -v dig >/dev/null 2>&1; then
    dig +short myip.opendns.com @resolver1.opendns.com

# Neither tool available
else
    echo "Error: neither nslookup nor dig is installed : apt install dnsutils" >&2
fi
