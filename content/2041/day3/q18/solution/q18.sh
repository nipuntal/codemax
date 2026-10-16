#!/bin/dash

seen=""
found=0

for f in "$@"; do
    dup=0
    for g in $seen; do
        if cmp -s "$f" "$g"; then
            dup=1
            break
        fi
    done
    if [ "$dup" -eq 1 ]; then
        echo "rm $f"
        found=1
    else
        seen="$seen $f"
    fi
done

[ "$found" -eq 0 ] && echo "No duplicate files"
exit 0
