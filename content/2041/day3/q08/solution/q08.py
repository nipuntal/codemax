#!/usr/bin/env python3
import sys

by_course = {}

for line in sys.stdin:
    course, zid, name, plan, sex = line.rstrip('\n').split('|')
    surname, given = name.rstrip().split(', ')
    first = given.split()[0]
    by_course.setdefault(course, {})[zid] = f"{first} {surname}"

for course in sorted(by_course):
    students = by_course[course]
    names = sorted(students.values())
    print(f"{course} {len(students)} student(s): {', '.join(names)}")
