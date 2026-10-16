#!/usr/bin/env python3
import sys

if len(sys.argv) != 2 or not sys.argv[1].isdigit() or int(sys.argv[1]) < 1:
    print(f"Usage: {sys.argv[0]} <positive-int>", file=sys.stderr)
    sys.exit(1)

n = int(sys.argv[1])

for i in range(1, n + 1):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
