#!/bin/dash

seen=""
processed=""
found=0

for f in "$@"; do
    case " $processed " in
        *" $f "*) continue ;;
    esac
    processed="$processed $f"

    original=""
    for g in $seen; do
        if cmp -s "$f" "$g"; then
            original=$g
            break
        fi
    done

    if [ -n "$original" ]; then
        echo "ln -s $original $f"
        found=1
    else
        seen="$seen $f"
    fi
done

[ "$found" -eq 0 ] && echo "No files can be replaced by symbolic links"
exit 0
