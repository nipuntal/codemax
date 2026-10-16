#!/usr/bin/env python3
import sys

for arg in sys.argv[1:]:
    clean = ''.join(c.lower() for c in arg if c.isalnum())
    if clean == clean[::-1]:
        print(arg, end=' ')
print()
