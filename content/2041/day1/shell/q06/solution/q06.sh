#!/bin/sh
tr 'A-Z' 'a-z' | tr -cs 'a-z' '\n' | sort | uniq -c | sort -rn | head -n 4
