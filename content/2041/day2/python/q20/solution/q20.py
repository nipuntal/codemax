#!/usr/bin/env python3
import sys

k = int(sys.argv[1]) if len(sys.argv) > 1 else 2

pairs = set()
for line in sys.stdin:
    fields = line.rstrip('\n').split('|')
    pairs.add((fields[0], fields[1]))

counts = {}
for course, zid in pairs:
    counts[zid] = counts.get(zid, 0) + 1

for zid in sorted((z for z in counts if counts[z] == k), key=int):
    print(zid)
