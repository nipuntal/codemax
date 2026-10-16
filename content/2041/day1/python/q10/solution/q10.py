#!/usr/bin/env python3
import sys

grid = [[int(x) for x in line.split()] for line in sys.stdin]

row_sums = [sum(row) for row in grid]
col_sums = [sum(row[c] for row in grid) for c in range(len(grid[0]))]

best = grid[0][0]
best_r = best_c = 0
for r in range(len(grid)):
    for c in range(len(grid[r])):
        if grid[r][c] > best:
            best = grid[r][c]
            best_r, best_c = r, c

print("row sums:", " ".join(str(x) for x in row_sums))
print("col sums:", " ".join(str(x) for x in col_sums))
print(f"total: {sum(row_sums)}")
print(f"max: {best} at ({best_r},{best_c})")
