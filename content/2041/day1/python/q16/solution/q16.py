#!/usr/bin/env python3
import sys
import re

pattern = re.compile(r'\[(\S+) (\S+)\] (\w+) \((\w+)\) (.*)')

total = 0
malformed = 0
levels = {}

for line in sys.stdin:
    line = line.strip()
    total += 1
    m = pattern.fullmatch(line)
    if not m:
        malformed += 1
        print(f"malformed: {line}")
        continue
    date, time, level, module, message = m.groups()
    levels[level] = levels.get(level, 0) + 1
    print(f"{time} {level} {module}: {message}")

summary = " ".join(f"{lv}={levels[lv]}" for lv in sorted(levels))
print(f"{total} lines, {malformed} malformed, levels: {summary}")
