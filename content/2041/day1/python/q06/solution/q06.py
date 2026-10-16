#!/usr/bin/env python3
import sys

total_lines = total_words = total_chars = 0
n_ok = 0

for filename in sys.argv[1:]:
    try:
        with open(filename) as f:
            lines = words = chars = 0
            for line in f:
                lines += 1
                words += len(line.split())
                chars += len(line)
    except IOError:
        print(f"q06.py: cannot open {filename}", file=sys.stderr)
        continue

    print(f"{filename}: {lines} lines, {words} words, {chars} characters")
    total_lines += lines
    total_words += words
    total_chars += chars
    n_ok += 1

if n_ok > 1:
    print(f"total: {total_lines} lines, {total_words} words, {total_chars} characters")
