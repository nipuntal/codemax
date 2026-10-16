#!/usr/bin/env python3
import sys
import re

factor = int(sys.argv[1])
NUMBER = r'[0-9]+\.?[0-9]*'

for line in sys.stdin:
    print(re.sub(NUMBER, lambda m: str(round(float(m.group()) * factor)), line), end='')
