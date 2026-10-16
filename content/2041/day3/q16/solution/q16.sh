#!/bin/dash

for f in "$@"; do
    if ! head -n 1 "$f" | grep -q '^#!'; then
        echo "# $f is not a script"
    elif [ -x "$f" ]; then
        echo "# $f is already executable"
    else
        echo "chmod 755 $f"
    fi
done
