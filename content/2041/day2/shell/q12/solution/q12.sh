#!/bin/dash
tr 'A-Z' 'a-z' | tr -cs 'a-z' '\n' | grep -E '[aeiou]{3}' | sort -u
