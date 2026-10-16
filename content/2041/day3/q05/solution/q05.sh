#!/bin/dash
grep '|M$' | cut -d'|' -f3 | cut -d',' -f1 | sort -u
