#!/bin/dash
cut -d'|' -f1 | sort | uniq -c | sort -k1,1rn -k2,2 | sed -E 's/^ +//'
