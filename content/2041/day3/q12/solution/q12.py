#!/usr/bin/env python3
import sys

with open(sys.argv[1]) as f:
    lines = f.read().splitlines()

for i in range(len(lines) - 1):
    if lines[i] > lines[i + 1]:
        print(f"Not sorted: line {i + 1}")
        break
else:
    print("Sorted")
