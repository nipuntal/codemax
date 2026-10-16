#!/bin/dash
cut -d'|' -f2,3 | sort -u | grep -E ', [^ ]+ [^ ]+' | sed -E 's/^.*, [^ ]+ ([^ ]+).*$/\1/' | sort
