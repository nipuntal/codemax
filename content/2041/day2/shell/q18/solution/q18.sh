#!/bin/dash

included=$(for f in "$@"; do
    sed -n -E 's/^#include "([^"]+)".*/\1/p' "$f"
done | sort -u)

for h in *.h; do
    [ -e "$h" ] || continue
    if ! echo "$included" | grep -qxF "$h"; then
        echo "$h"
    fi
done
