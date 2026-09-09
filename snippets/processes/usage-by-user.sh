ps -eo user,%mem | awk 'NR>1 {m[$1]+=$2} END {for (u in m) print m[u], u}' | sort -nr
