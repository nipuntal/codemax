#!/bin/dash

dir=$1

find "$dir" -type f |
sed "s|^$dir/||" |
sed 's|[^/]||g' |
sed 's|^|x|' |
sort |
uniq -c |
while read -r n slashes; do
    echo "depth $(( ${#slashes} )): $n"
done
