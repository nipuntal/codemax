#!/bin/dash
cut -d'|' -f1,5 | sort | uniq -c | sort -k1,1rn -k2,2 | head -n 5 | sed -E 's/^ *([0-9]+) ([^|]*)\|(.*)$/\1 \2 (\3)/'
