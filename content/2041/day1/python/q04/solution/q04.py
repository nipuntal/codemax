#!/usr/bin/env python3
import sys

nums = [int(line) for line in sys.stdin]
nums.sort()

n = len(nums)
mid = n // 2
if n % 2 == 1:
    median = nums[mid]
else:
    median = (nums[mid - 1] + nums[mid]) / 2

print(f"n: {n}")
print(f"sum: {sum(nums)}")
print(f"mean: {sum(nums) / n:.2f}")
print(f"median: {median:.2f}")
