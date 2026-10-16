#!/usr/bin/env python3
import sys

args = sys.argv[1:]
show_all = False
if args and args[0] == '-a':
    show_all = True
    args = args[1:]

file1, file2 = args


def load(filename):
    d = {}
    with open(filename) as f:
        for line in f:
            key, value = line.rstrip('\n').split('|', 1)
            d[key] = value
    return d


a = load(file1)
b = load(file2)

keys = (set(a) | set(b)) if show_all else (set(a) & set(b))

for key in sorted(keys):
    print(f"{key}|{a.get(key, '-')}|{b.get(key, '-')}")
