#!/bin/dash

start=$1
dict=$2

words=$(cat "$dict")

neighbour() {
    a=$1
    b=$2
    [ "${#a}" -ne "${#b}" ] && return 1
    diff=0
    i=1
    while [ "$i" -le "${#a}" ]; do
        ca=$(echo "$a" | cut -c"$i")
        cb=$(echo "$b" | cut -c"$i")
        [ "$ca" != "$cb" ] && diff=$((diff + 1))
        i=$((i + 1))
    done
    [ "$diff" -eq 1 ]
}

frontier=$start
seen=" $start "
echo "$frontier"

while [ -n "$frontier" ]; do
    next=""
    for w in $frontier; do
        for cand in $words; do
            case "$seen" in
                *" $cand "*) continue ;;
            esac
            if neighbour "$w" "$cand"; then
                seen="$seen$cand "
                next="$next $cand"
            fi
        done
    done
    frontier=$(echo "$next" | tr ' ' '\n' | grep -v '^$' | sort | tr '\n' ' ' | sed 's/ $//')
    [ -n "$frontier" ] && echo "$frontier"
done
exit 0
