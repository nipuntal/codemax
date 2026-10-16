#!/usr/bin/env python3
import sys


def is_isogram(word):
    w = word.lower()
    return len(set(w)) == len(w)


for line in sys.stdin:
    words = line.split()
    print(' '.join(w for w in words if is_isogram(w)))
