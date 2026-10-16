#!/usr/bin/env python3
import sys

by_course = {}
courses_of = {}

for line in sys.stdin:
    course, name, mark = line.split()
    mark = int(mark)
    by_course.setdefault(course, []).append((name, mark))
    courses_of.setdefault(name, set()).add(course)

for course in sorted(by_course):
    pairs = by_course[course]
    avg = sum(m for _, m in pairs) / len(pairs)
    top_name, top_mark = sorted(pairs, key=lambda p: (-p[1], p[0]))[0]
    print(f"{course}: {len(pairs)} students, avg {avg:.1f}, top {top_name} ({top_mark})")

multi = sorted(n for n in courses_of if len(courses_of[n]) > 1)
print(f"students enrolled in more than one course: {', '.join(multi)}")
