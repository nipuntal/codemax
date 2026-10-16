#!/bin/sh
awk '$9 == 200 {print $7}' | sort | uniq -c | sort -rn | head -n 3
