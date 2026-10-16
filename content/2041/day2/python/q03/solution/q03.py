#!/usr/bin/env python3
import sys

args = sys.argv[1:]

counts = {}
for a in args:
    counts[a] = counts.get(a, 0) + 1

print(' '.join(a for a in args if counts[a] == 1))
