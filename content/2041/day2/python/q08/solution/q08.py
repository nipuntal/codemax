#!/usr/bin/env python3
import sys

n = int(sys.argv[1])
seen = set()
lines = 0

for line in sys.stdin:
    lines += 1
    for word in line.lower().split():
        seen.add(word)
    if len(seen) >= n:
        print(f"{n} distinct words seen after {lines} lines read.")
        break
else:
    print(f"End of input reached after {lines} lines read - {n} different words not seen.")
