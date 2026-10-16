#!/bin/dash

regex=$1
file=$2

years=$(grep -E "^($regex)\|" "$file" | cut -d'|' -f2 | sort -nu)

if [ -z "$years" ]; then
    echo "No award matching '$regex'"
    exit 0
fi

first=$(echo "$years" | head -n 1)
last=$(echo "$years" | tail -n 1)

y=$first
while [ "$y" -le "$last" ]; do
    if ! echo "$years" | grep -qx "$y"; then
        echo "$y"
    fi
    y=$((y + 1))
done
