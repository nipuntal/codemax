#!/usr/bin/env python3
import sys


def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True


def digit_sum(n):
    return sum(int(c) for c in str(n))


def reverse_number(n):
    return int(str(n)[::-1])


def main():
    for line in sys.stdin:
        n = int(line)
        p = "yes" if is_prime(n) else "no"
        print(f"{n} prime={p} digitsum={digit_sum(n)} reverse={reverse_number(n)}")


if __name__ == '__main__':
    main()
