#!/usr/bin/env python3
import sys

total_lines = total_chars = total_words = 0

for line in sys.stdin:
    line = line.rstrip('\n')
    n = len(line)
    w = len(line.split())
    print(f"{n} {w}: {line}")
    total_lines += 1
    total_chars += n
    total_words += w

print(f"total: {total_lines} lines, {total_chars} characters, {total_words} words")
