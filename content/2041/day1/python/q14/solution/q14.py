#!/usr/bin/env python3
import sys
import re

for line in sys.stdin:
    line = line.strip()
    if re.fullmatch(r'z\d{7}', line):
        kind = "zid"
    elif re.search(r'\w@\w', line):
        kind = "email"
    elif re.fullmatch(r'\d{2}/\d{2}/\d{4}', line):
        kind = "date"
    elif re.fullmatch(r'-?\d+', line):
        kind = "int"
    elif re.fullmatch(r'[A-Za-z]+', line):
        kind = "word"
    else:
        kind = "other"
    print(f"{line} -> {kind}")
