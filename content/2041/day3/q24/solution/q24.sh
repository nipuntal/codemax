#!/bin/dash

regex=$1
file=$2

names=$(cut -d'|' -f1 "$file" | sort -u | grep -E "^($regex)$")

if [ -z "$names" ]; then
    echo "No award matching '$regex'"
    exit 0
fi

echo "$names" | while read -r name; do
    years=$(grep -E "^$name\|" "$file" | cut -d'|' -f2 | sort -n)
    first=$(echo "$years" | head -n 1)
    last=$(echo "$years" | tail -n 1)
    n=$(echo "$years" | wc -l)
    echo "$name $first-$last ($((n)) awards)"
done
