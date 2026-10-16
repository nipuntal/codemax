#!/usr/bin/env python3
import sys

n = int(sys.argv[1])
filename = sys.argv[2]

with open(filename) as f:
    lines = f.read().splitlines()

out = []
todo = list(lines)

while todo:
    line = todo.pop(0)

    if len(line) <= n or ' ' not in line:
        out.append(line)
        continue

    head = line[:n]
    if ' ' in head:
        pos = head.rindex(' ')
    else:
        pos = line.index(' ')

    out.append(line[:pos])
    todo.insert(0, line[pos + 1:])

with open(filename, 'w') as f:
    for line in out:
        print(line, file=f)
