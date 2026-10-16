#!/bin/dash

for f in "$@"; do
    case "$f" in
        *.*) echo "# $f already has an extension"; continue ;;
    esac

    line=$(head -n 1 "$f")

    case "$line" in
        '#!'*) ;;
        *) echo "# $f does not have a #! line"; continue ;;
    esac

    case "$line" in
        *python*) ext=py ;;
        *perl*)   ext=pl ;;
        *sh*)     ext=sh ;;
        *) echo "# $f no extension for #! line"; continue ;;
    esac

    if [ -e "$f.$ext" ]; then
        echo "# $f.$ext already exists"
    else
        echo "mv $f $f.$ext"
    fi
done
