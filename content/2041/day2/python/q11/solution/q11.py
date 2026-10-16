#!/usr/bin/env python3
import sys
import re

args = sys.argv[1:]
invert = False
ignore_case = False
numbered = False

while args and args[0].startswith('-'):
    if args[0] == '-v':
        invert = True
    elif args[0] == '-i':
        ignore_case = True
    elif args[0] == '-n':
        numbered = True
    args.pop(0)

pattern, filename = args
regex = re.compile(pattern, re.I if ignore_case else 0)

with open(filename) as f:
    for i, line in enumerate(f, 1):
        matched = bool(regex.search(line))
        if matched != invert:
            if numbered:
                print(f"{i}:{line}", end='')
            else:
                print(line, end='')
