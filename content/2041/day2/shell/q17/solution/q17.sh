#!/bin/dash

best=""
best_n=-1

for f in "$@"; do
    n=$(wc -L < "$f")
    if [ "$n" -gt "$best_n" ]; then
        best_n=$n
        best=$f
    fi
done

echo "$best"
