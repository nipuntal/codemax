#!/bin/dash

for arg in "$@"; do
    if echo "$arg" | tr 'A-Z' 'a-z' | grep -Eq '([a-z])\1'; then
        printf '%s ' "$arg"
    fi
done
echo
