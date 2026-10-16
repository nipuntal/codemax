#!/usr/bin/env python3
import sys
import os

if len(sys.argv) != 2 or not os.path.isdir(sys.argv[1]):
    print(f"Usage: {sys.argv[0]} <directory>", file=sys.stderr)
    sys.exit(1)

directory = sys.argv[1]

n_files = 0
n_dirs = 0
total = 0

for name in sorted(os.listdir(directory)):
    path = os.path.join(directory, name)
    if os.path.isdir(path):
        print(f"{name}  dir  -")
        n_dirs += 1
    else:
        size = os.path.getsize(path)
        print(f"{name}  file  {size}")
        n_files += 1
        total += size

print(f"{n_files} files, {n_dirs} dirs, {total} bytes")
