#!/usr/bin/env python3
import sys


def is_balanced(word):
    counts = {}
    for c in word.lower():
        counts[c] = counts.get(c, 0) + 1
    return len(set(counts.values())) == 1


for line in sys.stdin:
    words = line.split()
    print(' '.join(w for w in words if is_balanced(w)))
