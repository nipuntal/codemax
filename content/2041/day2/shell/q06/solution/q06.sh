#!/bin/dash
grep -E '^COMP(3311|3331|3411)\|' | cut -d'|' -f2,3 | sort -u | cut -d',' -f1 | cut -d'|' -f2 | sort | uniq -c | sort -k1,1rn -k2,2 | head -n 1 | sed -E 's/^ *[0-9]+ //'
