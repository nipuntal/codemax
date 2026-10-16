#!/usr/bin/env python3
import sys

students = []
for line in sys.stdin:
    name, course, mark = line.split()
    students.append((name, course, int(mark)))

print("By mark:")
for name, course, mark in sorted(students, key=lambda s: (-s[2], s[0])):
    print(f"{name} {mark}")

print("By name length:")
for name, course, mark in sorted(students, key=lambda s: (len(s[0]), s[0])):
    print(f"{name} {mark}")

print("By course then mark:")
for name, course, mark in sorted(students, key=lambda s: (s[1], -s[2])):
    print(f"{course} {name} {mark}")
