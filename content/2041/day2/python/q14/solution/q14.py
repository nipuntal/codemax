#!/usr/bin/env python3
import sys
import re

lines = sys.stdin.read().splitlines()

for line in lines:
    m = re.fullmatch(r'#(\d+)(?:\*(\d+))?', line)
    if m:
        n = int(m.group(1))
        k = int(m.group(2)) if m.group(2) else 1
        for _ in range(k):
            print(lines[n - 1])
    else:
        print(line)
