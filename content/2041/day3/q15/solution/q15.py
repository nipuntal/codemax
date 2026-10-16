#!/usr/bin/env python3
import sys
import re

args = sys.argv[1:]
delete = ''
squeeze = False
upper = False

i = 0
while i < len(args):
    if args[i] == '-d':
        i += 1
        delete = args[i]
    elif args[i] == '-s':
        squeeze = True
    elif args[i] == '-u':
        upper = True
    i += 1

for line in sys.stdin:
    line = line.rstrip('\n')
    if delete:
        line = ''.join(c for c in line if c not in delete)
    if squeeze:
        line = re.sub(r'\s+', ' ', line)
    if upper:
        line = line.upper()
    print(line)
