#!/usr/bin/env python3
import sys

stats = {}
total = 0

for line in sys.stdin:
    award, year, name, gender, country, birth = line.rstrip('\n').split('|')
    year = int(year)
    age = year - int(birth)

    if award not in stats:
        stats[award] = {'n': 0, 'f': 0, 'first': year, 'last': year, 'oldest': age}
    s = stats[award]
    s['n'] += 1
    if gender == 'Female':
        s['f'] += 1
    s['first'] = min(s['first'], year)
    s['last'] = max(s['last'], year)
    s['oldest'] = max(s['oldest'], age)
    total += 1

for award in sorted(stats):
    s = stats[award]
    print(f"{award}: {s['n']} winners, {s['f']} female, "
          f"span {s['first']}-{s['last']}, oldest winner aged {s['oldest']}")

print(f"TOTAL: {total} winners across {len(stats)} awards")
