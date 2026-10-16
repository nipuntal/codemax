#!/usr/bin/env python3
import sys

counts = {}
for line in sys.stdin:
    fields = line.rstrip('\n').split('|')
    country = fields[4]
    counts[country] = counts.get(country, 0) + 1

for country, n in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:5]:
    print(f"{country} {n}")
