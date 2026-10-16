#!/bin/dash

file=$1
tmp=$(mktemp)

tr 'a-z' 'A-Z' < "$file" > "$tmp"
mv "$tmp" "$file"
