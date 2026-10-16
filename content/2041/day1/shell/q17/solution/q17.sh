#!/bin/bash

total=0
count=0

while IFS=: read -r name course mark; do
    echo "$name scored $mark in $course"
    total=$((total + mark))
    count=$((count + 1))
done

echo "average: $((total / count))"
