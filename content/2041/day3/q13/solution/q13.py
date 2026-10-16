#!/usr/bin/env python3
import sys

with open(sys.argv[1]) as f:
    lines1 = f.readlines()
with open(sys.argv[2]) as f:
    lines2 = f.readlines()

if len(lines1) != len(lines2):
    print(f"Not mirrored: different number of lines: {len(lines1)} versus {len(lines2)}")
    sys.exit(0)

reversed2 = lines2[::-1]

for i in range(len(lines1)):
    if lines1[i] != reversed2[i]:
        print(f"Not mirrored: line {i + 1} different")
        sys.exit(0)

print("Mirrored")
