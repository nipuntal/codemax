#!/usr/bin/env python3
import sys

with open(sys.argv[1]) as f:
    lines = f.read().splitlines()

lines.sort(key=lambda l: (len(l.split()), l))

for line in lines:
    print(line)
