#!/usr/bin/env python3
import sys

surnames = set()
for line in sys.stdin:
    course, zid, name, plan, gender = line.rstrip('\n').split('|')
    if gender == 'M':
        surnames.add(name.split(',')[0])

for surname in sorted(surnames):
    print(surname)
