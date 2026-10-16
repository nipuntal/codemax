#!/bin/dash
cut -d'|' -f2,3 | sort -u | cut -d'|' -f2 | cut -d',' -f1 | sort
