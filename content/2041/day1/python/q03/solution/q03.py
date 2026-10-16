#!/usr/bin/env python3
import sys

for line in sys.stdin:
    words = line.split()
    if not words:
        continue
    print(f"{len(words)} words: {'|'.join(words)}")
