#!/bin/dash

file=$1

first=$(sort -n "$file" | head -n 1)
last=$(sort -n "$file" | tail -n 1)

seq "$first" "$last" | sort > /tmp/q10_all.$$
sort "$file" > /tmp/q10_have.$$
comm -23 /tmp/q10_all.$$ /tmp/q10_have.$$
rm -f /tmp/q10_all.$$ /tmp/q10_have.$$
