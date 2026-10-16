#!/bin/bash

total=0

for f in data/*.txt; do
    name=$(basename "$f" .txt)
    n=$(wc -w < "$f")
    echo "$name has $((n)) words"
    total=$((total + n))
done

echo "total: $total"
