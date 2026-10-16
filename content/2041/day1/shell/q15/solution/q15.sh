#!/bin/bash

for f in "$@"; do
    if [ -f "$f" ]; then
        n=$(wc -l < "$f")
        echo "$f: $((n)) lines"
    else
        echo "$f: not found"
    fi
done
