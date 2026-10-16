#!/usr/bin/env python3
import sys

if len(sys.argv) != 3:
    print(f"Usage: {sys.argv[0]} <file1> <file2>", file=sys.stderr)
    sys.exit(1)

file1, file2 = sys.argv[1], sys.argv[2]

with open(file1) as f:
    a = set(f.read().split())
with open(file2) as f:
    b = set(f.read().split())

print(f"only in {file1}: {' '.join(sorted(a - b))}")
print(f"only in {file2}: {' '.join(sorted(b - a))}")
print(f"in both: {' '.join(sorted(a & b))}")
print(f"total distinct: {len(a | b)}")
