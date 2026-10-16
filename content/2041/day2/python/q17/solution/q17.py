#!/usr/bin/env python3
import sys

args = sys.argv[1:]
n = 10

if len(args) >= 2 and args[0] == '-n':
    n = int(args[1])
    args = args[2:]

files = args


def head(f, n):
    for i, line in enumerate(f):
        if i >= n:
            break
        print(line, end='')


if not files:
    head(sys.stdin, n)
else:
    printed_any = False
    for name in files:
        try:
            f = open(name)
        except IOError:
            print(f"q17.py: cannot open {name}", file=sys.stderr)
            continue
        if printed_any:
            print()
        printed_any = True
        if len(files) > 1:
            print(f"==> {name} <==")
        with f:
            head(f, n)
