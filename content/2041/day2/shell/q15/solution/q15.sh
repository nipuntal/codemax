#!/bin/dash

for f in *.bak; do
    [ -e "$f" ] || continue
    new=${f%.bak}
    if [ -e "$new" ]; then
        echo "$new exists"
        exit 1
    fi
    mv "$f" "$new"
done
