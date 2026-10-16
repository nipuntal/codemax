#!/bin/dash

start=$1
stop=$2
file=$3

i=$start
while [ "$i" -ge "$stop" ]; do
    echo "$i"
    i=$((i - 1))
done > "$file"
