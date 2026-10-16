#!/bin/dash

tmp=$(mktemp)
cat > "$tmp"

ncols=$(head -n 1 "$tmp" | tr '|' '\n' | wc -l)

i=1
while [ "$i" -le "$ncols" ]; do
    cut -d'|' -f"$i" "$tmp" | tr '\n' '|' | sed 's/|$//'
    echo
    i=$((i + 1))
done

rm -f "$tmp"
