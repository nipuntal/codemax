#!/usr/bin/env python3
import sys

marks = []
for line in sys.stdin:
    name, mark = line.split()
    mark = int(mark)
    marks.append(mark)
    print(f"{name:<12}{mark:>4} {'*' * (mark // 10)}")

average = sum(marks) / len(marks)
print(f"{'average':<12}{average:>4.1f}")
