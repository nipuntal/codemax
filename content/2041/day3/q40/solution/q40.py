#!/usr/bin/env python3
import sys

years_of = {}

for line in sys.stdin:
    award, year, name, gender, country, birth = line.rstrip('\n').split('|')
    years_of.setdefault(award, set()).add(int(year))

best_award = None
best_len = 0

for award in sorted(years_of):
    years = sorted(years_of[award])

    longest = 1
    long_start = years[0]
    run = 1
    run_start = years[0]

    for i in range(1, len(years)):
        if years[i] == years[i - 1] + 1:
            run += 1
        else:
            run = 1
            run_start = years[i]
        if run > longest:
            longest = run
            long_start = run_start

    print(f"{award}: longest streak {longest} years "
          f"({long_start}-{long_start + longest - 1})")

    if longest > best_len:
        best_len = longest
        best_award = award

print(f"Best: {best_award} ({best_len} years)")
