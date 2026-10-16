#!/bin/dash
grep -E '^COMP(2041|9044)\|' | cut -d'|' -f2 | sort -nu
