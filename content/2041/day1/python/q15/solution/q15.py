#!/usr/bin/env python3
import sys
import re

for line in sys.stdin:
    line = re.sub(r'\s+', ' ', line)
    line = line.strip()
    line = re.sub(r'\d+', lambda m: str(int(m.group()) * 2), line)
    line = re.sub(r'colou?r', 'color', line, flags=re.I)
    line = re.sub(r',\s*', ', ', line)
    print(line)
