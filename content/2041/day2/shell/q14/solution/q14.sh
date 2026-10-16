#!/bin/dash

n=$1
prefix=$2

i=1
while [ "$i" -le "$n" ]; do
    echo "note $i of $n" > "${prefix}${i}.txt"
    i=$((i + 1))
done
