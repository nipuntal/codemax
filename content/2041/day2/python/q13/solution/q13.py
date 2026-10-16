#!/usr/bin/env python3
import sys

n = int(sys.argv[1])


def shift(c, base, size):
    return chr((ord(c) - ord(base) + n) % size + ord(base))


def encrypt(c):
    if c.islower():
        return shift(c, 'a', 26)
    if c.isupper():
        return shift(c, 'A', 26)
    if c.isdigit():
        return shift(c, '0', 10)
    return c


sys.stdout.write(''.join(encrypt(c) for c in sys.stdin.read()))
