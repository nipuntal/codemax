#!/usr/bin/env python3
import sys

args = sys.argv[1:]
show_count = '-c' in args
dups_only = '-d' in args
ignore_case = '-i' in args


def emit(line, count):
    if dups_only and count == 1:
        return
    if show_count:
        print(f"{count:4} {line}")
    else:
        print(line)


prev = None
prev_key = None
count = 0

for line in sys.stdin:
    line = line.rstrip('\n')
    key = line.lower() if ignore_case else line
    if count and key == prev_key:
        count += 1
    else:
        if count:
            emit(prev, count)
        prev, prev_key, count = line, key, 1

if count:
    emit(prev, count)
