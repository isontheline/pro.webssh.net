find / -xdev -type f -size +100M -exec ls -lh {} + 2>/dev/null | sort -k5 -h | tail -n 20
