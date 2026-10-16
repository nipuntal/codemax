#!/bin/dash

dir1=$1
dir2=$2

for path in "$dir1"/*; do
    [ -f "$path" ] || continue
    name=${path##*/}
    [ -f "$dir2/$name" ] || continue
    if ! cmp -s "$dir1/$name" "$dir2/$name"; then
        echo "$name"
    fi
done
