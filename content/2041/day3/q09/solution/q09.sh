#!/bin/dash

count=0
sum=0

while read -r n; do
    count=$((count + 1))
    sum=$((sum + n))
done < "$1"

echo "count: $count"
echo "sum: $sum"
echo "mean: $((sum / count))"
