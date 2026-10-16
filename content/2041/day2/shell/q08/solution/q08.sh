#!/bin/dash
cut -d'|' -f2,4 | sort -u | cut -d'|' -f2 | cut -d'/' -f1 | sort | uniq -c | sed -E 's/^ *([0-9]+) (.*)$/\2 \1/' | sort -k2,2rn -k1,1
