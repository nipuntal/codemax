#!/usr/bin/env python3
import sys

filename = sys.argv[1]

with open(filename) as f:
    lines = [line.rstrip() for line in f]

out = []
for line in lines:
    if line == '' and out and out[-1] == '':
        continue
    out.append(line)

while out and out[0] == '':
    out.pop(0)
while out and out[-1] == '':
    out.pop()

with open(filename, 'w') as f:
    for line in out:
        print(line, file=f)
