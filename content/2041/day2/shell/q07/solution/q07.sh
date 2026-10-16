#!/bin/dash
cut -d'|' -f1,2 | sort -u | cut -d'|' -f2 | sort | uniq -c | grep -E '^ *([3-9]|[0-9]{2,}) ' | sed -E 's/^ *[0-9]+ //' | sort -n
