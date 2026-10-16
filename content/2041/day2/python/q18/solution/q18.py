#!/usr/bin/env python3
import sys

args = sys.argv[1:]
show_n = '-n' in args
show_v = '-v' in args
files = [a for a in args if a not in ('-n', '-v')]

number = 1


def visible(c):
    o = ord(c)
    if o == 127:
        return '^?'
    if o < 32 and c != '\n':
        return '^' + chr(o + 64)
    return c


def do_file(f):
    global number
    for line in f:
        if show_v:
            line = ''.join(visible(c) for c in line)
        if show_n:
            line = f"{number:6}  {line}"
        print(line, end='')
        number += 1


if not files:
    do_file(sys.stdin)
else:
    for name in files:
        with open(name) as f:
            do_file(f)
