ps -eo pid,ppid,stat,comm | awk '$3 ~ /^Z/'
