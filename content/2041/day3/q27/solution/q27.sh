#!/bin/dash

d1=$1
d2=$2

same=0
diff=0
only1=0
only2=0

for path in $(find "$d1" -type f | sed "s|^$d1/||" | sort); do
    if [ -f "$d2/$path" ]; then
        s1=$(wc -c < "$d1/$path")
        s2=$(wc -c < "$d2/$path")
        if [ "$s1" -eq "$s2" ]; then
            same=$((same + 1))
        else
            diff=$((diff + 1))
        fi
    else
        only1=$((only1 + 1))
    fi
done

for path in $(find "$d2" -type f | sed "s|^$d2/||" | sort); do
    if [ ! -f "$d1/$path" ]; then
        only2=$((only2 + 1))
    fi
done

echo "$same $diff $only1 $only2"
