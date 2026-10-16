#!/bin/dash

files="a b c d e f g h"

file_index() {
    i=1
    for f in $files; do
        [ "$f" = "$1" ] && echo "$i" && return
        i=$((i + 1))
    done
}

index_file() {
    i=1
    for f in $files; do
        [ "$i" -eq "$1" ] && echo "$f" && return
        i=$((i + 1))
    done
}

frontier=$1
seen=" $1 "
echo "$frontier"

while [ -n "$frontier" ]; do
    next=""
    for sq in $frontier; do
        c=$(file_index "$(echo "$sq" | cut -c1)")
        r=$(echo "$sq" | cut -c2)
        for dc in -1 0 1; do
            for dr in -1 0 1; do
                [ "$dc" -eq 0 ] && [ "$dr" -eq 0 ] && continue
                nc=$((c + dc))
                nr=$((r + dr))
                [ "$nc" -lt 1 ] || [ "$nc" -gt 8 ] && continue
                [ "$nr" -lt 1 ] || [ "$nr" -gt 8 ] && continue
                new="$(index_file "$nc")$nr"
                case "$seen" in
                    *" $new "*) continue ;;
                esac
                seen="$seen$new "
                next="$next $new"
            done
        done
    done
    frontier=$(echo "$next" | tr ' ' '\n' | grep -v '^$' | sort | tr '\n' ' ' | sed 's/ $//')
    [ -n "$frontier" ] && echo "$frontier"
done
