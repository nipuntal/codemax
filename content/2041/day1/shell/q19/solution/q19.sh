#!/bin/bash

classify() {
    case "$1" in
        *.txt|*.md)          echo "text" ;;
        *.sh)                echo "shell script" ;;
        *.py)                echo "python script" ;;
        *.png|*.jpg|*.gif)   echo "image" ;;
        *)                   echo "unknown" ;;
    esac
}

quiet=0
if [ "$1" = "-q" ]; then
    quiet=1
    shift
fi

if [ $# -eq 0 ]; then
    echo "Usage: $0 [-q] file..." 1>&2
    exit 1
fi

for f in "$@"; do
    type=$(classify "$f")
    if [ "$quiet" -eq 1 ]; then
        echo "$type"
    else
        echo "$f: $type"
    fi
done
