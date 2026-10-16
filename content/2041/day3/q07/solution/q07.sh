#!/bin/dash
grep '|F$' | cut -d'|' -f2,3 | sort -u | sed -E 's/^[0-9]+\|[^,]*, ([^ ]+).*/\1/' | sort | uniq -c | sort -k1,1rn -k2,2 | head -n 1 | sed -E 's/^ *[0-9]+ //'
