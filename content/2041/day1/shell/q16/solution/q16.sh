#!/bin/bash

while read -r mark; do
    if ! echo "$mark" | grep -Eq '^[0-9]+$'; then
        echo "$mark invalid"
    elif [ "$mark" -ge 85 ]; then
        echo "$mark HD"
    elif [ "$mark" -ge 75 ]; then
        echo "$mark DN"
    elif [ "$mark" -ge 65 ]; then
        echo "$mark CR"
    elif [ "$mark" -ge 50 ]; then
        echo "$mark PS"
    else
        echo "$mark FL"
    fi
done
