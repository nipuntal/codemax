#!/usr/bin/env python3
import sys

args = sys.argv[1:]
delim = None
spec = None
filenames = []

i = 0
while i < len(args):
    a = args[i]
    if a.startswith('-d'):
        if a == '-d':
            i += 1
            delim = args[i]
        else:
            delim = a[2:]
    elif a.startswith('-f'):
        if a == '-f':
            i += 1
            spec = args[i]
        else:
            spec = a[2:]
    else:
        filenames.append(a)
    i += 1

ranges = []
for part in spec.split(','):
    if '-' in part:
        lo, hi = part.split('-')
        ranges.append((int(lo) if lo else 1, int(hi) if hi else None))
    else:
        ranges.append((int(part), int(part)))


def do_line(line):
    line = line.rstrip('\n')
    if delim not in line:
        print(line)
        return
    fields = line.split(delim)
    wanted = set()
    for lo, hi in ranges:
        top = len(fields) if hi is None else hi
        for n in range(lo, top + 1):
            wanted.add(n)
    out = [fields[n - 1] for n in sorted(wanted) if 1 <= n <= len(fields)]
    print(delim.join(out))


if filenames:
    for name in filenames:
        with open(name) as f:
            for line in f:
                do_line(line)
else:
    for line in sys.stdin:
        do_line(line)
