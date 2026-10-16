#!/usr/bin/env python3
import sys

counts = {}
for line in sys.stdin:
    for word in line.lower().split():
        counts[word] = counts.get(word, 0) + 1

for word in sorted(counts):
    print(f"{word} {counts[word]}")
