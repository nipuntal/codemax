#!/usr/bin/env python3
import sys

if len(sys.argv) < 2:
    print(f"Usage: {sys.argv[0]} <int>...", file=sys.stderr)
    sys.exit(1)

nums = [int(a) for a in sys.argv[1:]]

print(f"count: {len(nums)}")
print(f"sum: {sum(nums)}")
print(f"max: {max(nums)}")
print(f"min: {min(nums)}")
