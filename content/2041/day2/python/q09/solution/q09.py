#!/usr/bin/env python3
import sys
import re

NUMBER = r'-?(?:\d+\.?\d*|\.\d+)'

lines = sys.stdin.readlines()

minima = []
for line in lines:
    nums = [float(x) for x in re.findall(NUMBER, line)]
    minima.append(min(nums) if nums else None)

best = None
for m in minima:
    if m is not None and (best is None or m < best):
        best = m

if best is not None:
    for line, m in zip(lines, minima):
        if m == best:
            print(line, end='')
