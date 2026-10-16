#!/usr/bin/env python3
import sys

rows = [line.rstrip('\n').split('|') for line in sys.stdin]
if not rows:
    sys.exit(0)

ncols = len(rows[0])
widths = [max(len(row[c]) for row in rows) for c in range(ncols)]
numeric = [all(row[c].isdigit() for row in rows[1:]) for c in range(ncols)]

for row in rows:
    cells = []
    for c in range(ncols):
        if numeric[c]:
            cells.append(f"{row[c]:>{widths[c]}}")
        else:
            cells.append(f"{row[c]:<{widths[c]}}")
    print('  '.join(cells).rstrip())
