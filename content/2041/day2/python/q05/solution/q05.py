#!/usr/bin/env python3
import sys

n = int(sys.argv[1])
counts = {}

for line in sys.stdin:
    original = line.rstrip('\n')
    key = ' '.join(original.lower().split())
    counts[key] = counts.get(key, 0) + 1
    if counts[key] == n:
        print(f"Snap: {original}")
        break
