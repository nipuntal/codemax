#!/usr/bin/env python3
import sys

course_counts = {}
courses_of = {}
names = {}
by_first = {}

for line in sys.stdin:
    course, zid, name, prog, sex = line.rstrip('\n').split('|')
    surname, given = name.rstrip().split(', ')
    first = given.split()[0]

    course_counts[course] = course_counts.get(course, 0) + 1
    courses_of.setdefault(zid, set()).add(course)
    names[zid] = f"{first} {surname}"
    by_first.setdefault(first, set()).add(zid)

print(f"students: {len(courses_of)}")
print(f"courses: {len(course_counts)}")

print("Enrolments per course:")
for course, n in sorted(course_counts.items(), key=lambda kv: (-kv[1], kv[0])):
    print(f"  {course} {n}")

print("Students in most courses:")
top = sorted(courses_of.items(), key=lambda kv: (-len(kv[1]), kv[0]))[:3]
for zid, cs in top:
    print(f"  {zid} {names[zid]} ({len(cs)} courses)")

print("Shared first names:")
for first in sorted(by_first):
    zids = by_first[first]
    if len(zids) > 1:
        print(f"  {first}: {', '.join(sorted(zids))}")
