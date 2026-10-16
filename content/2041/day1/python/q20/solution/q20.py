#!/usr/bin/env python3
import sys


def avg(xs):
    return sum(xs) / len(xs)


def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <csvfile>", file=sys.stderr)
        sys.exit(1)

    try:
        with open(sys.argv[1]) as f:
            lines = f.readlines()
    except IOError:
        print(f"Usage: {sys.argv[0]} <csvfile>", file=sys.stderr)
        sys.exit(1)

    by_student = {}
    by_course = {}
    failed = set()

    for line in lines[1:]:
        line = line.strip()
        if not line:
            continue
        zid, course, term, mark = line.split(',')
        mark = int(mark)
        by_student.setdefault(zid, []).append(mark)
        by_course.setdefault(course, []).append(mark)
        if mark < 50:
            failed.add(zid)

    print(f"Students: {len(by_student)}")
    print(f"Courses: {len(by_course)}")

    print("Top students:")
    top = sorted(by_student.items(), key=lambda kv: (-avg(kv[1]), kv[0]))[:3]
    for zid, marks in top:
        print(f"  {zid} {avg(marks):.1f}")

    print("Course averages:")
    for course in sorted(by_course):
        marks = by_course[course]
        print(f"  {course} {avg(marks):.1f} ({len(marks)} students)")

    print(f"Failed at least one course: {', '.join(sorted(failed))}")


if __name__ == '__main__':
    main()
