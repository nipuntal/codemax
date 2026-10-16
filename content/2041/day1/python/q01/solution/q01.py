#!/usr/bin/env python3
import sys

for i, line in enumerate(sys.stdin, 1):
    print(f"{i}: {line.strip()}")
