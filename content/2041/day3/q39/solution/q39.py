#!/usr/bin/env python3
import sys

name1, name2 = sys.argv[1], sys.argv[2]

with open(name1) as f:
    lines1 = f.readlines()
with open(name2) as f:
    lines2 = f.readlines()

common = min(len(lines1), len(lines2))
differing = [i for i in range(common) if lines1[i] != lines2[i]]

if len(lines1) != len(lines2):
    print(f"{name1} has {len(lines1)} lines, {name2} has {len(lines2)} lines; "
          f"{len(differing)} common line(s) differ")
elif differing:
    print(f"{len(differing)} line(s) differ, first at line {differing[0] + 1}")
else:
    print("identical")
