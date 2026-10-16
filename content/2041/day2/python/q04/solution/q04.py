#!/usr/bin/env python3
import sys

filename = sys.argv[1]
n = int(sys.argv[2])

with open(filename) as f:
    lines = f.readlines()

skip = (len(lines) - n) // 2

for line in lines[skip:skip + n]:
    print(line, end='')
