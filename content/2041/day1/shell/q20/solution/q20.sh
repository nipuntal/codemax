#!/bin/bash

if [ $# -ne 1 ] || [ ! -f "$1" ]; then
    echo "Usage: $0 <csvfile>" 1>&2
    exit 1
fi

file=$1

echo "Regions:"
for region in $(tail -n +2 "$file" | cut -d, -f2 | sort -u); do
    total=0
    while IFS=, read -r date r item amount; do
        if [ "$r" = "$region" ]; then
            total=$((total + amount))
        fi
    done < <(tail -n +2 "$file")
    echo "  $region: $total"
done

top=$(tail -n +2 "$file" | cut -d, -f3 | sort | uniq -c | sort -rn | head -n 1)
top_count=$(echo "$top" | awk '{print $1}')
top_item=$(echo "$top" | awk '{print $2}')
echo "Top item: $top_item ($top_count sales)"

grand=0
while IFS=, read -r date r item amount; do
    grand=$((grand + amount))
done < <(tail -n +2 "$file")
echo "Grand total: $grand"
