#!/usr/bin/env python3
import sys

counts = {}

for line in sys.stdin:
    if line.startswith('#'):
        continue
    fields = line.split()
    if not fields:
        continue
    date = fields[0]
    counts[date] = counts.get(date, 0) + 1

top = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:3]
for date, count in top:
    print(f"{count} {date}")
