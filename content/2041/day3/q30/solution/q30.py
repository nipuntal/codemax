#!/usr/bin/env python3
import sys

MOVES = [(1, 2), (1, -2), (-1, 2), (-1, -2),
         (2, 1), (2, -1), (-2, 1), (-2, -1)]

start = sys.argv[1]
frontier = [start]
seen = {start}

print(start)

while frontier:
    nxt = set()
    for square in frontier:
        c = ord(square[0]) - ord('a') + 1
        r = int(square[1])
        for dc, dr in MOVES:
            nc, nr = c + dc, r + dr
            if 1 <= nc <= 8 and 1 <= nr <= 8:
                new = chr(ord('a') + nc - 1) + str(nr)
                if new not in seen:
                    seen.add(new)
                    nxt.add(new)
    frontier = sorted(nxt)
    if frontier:
        print(' '.join(frontier))
