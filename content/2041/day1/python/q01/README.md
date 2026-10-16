# Python Q1 — reading stdin  (basics)

**Difficulty:** ⭐ · **Target time:** 4 min

---
## LEARN FIRST

In COMP2041, Python programs are **filters**, just like shell ones: read stdin,
write stdout. Every script starts with:

```python
#!/usr/bin/env python3
import sys
```

### Reading stdin — the three ways

```python
for line in sys.stdin:          # one line at a time  <-- use this by default
    print(line, end='')
```
```python
lines = sys.stdin.readlines()   # a LIST of all lines (each still ends in \n)
```
```python
text = sys.stdin.read()         # ONE big string
```

### The `\n` problem
Lines from `sys.stdin` **keep their trailing newline**. `print()` adds another one.
So this prints double-spaced output:
```python
for line in sys.stdin:
    print(line)                 # BAD: blank line between every line
```
Two fixes — learn both:
```python
    print(line, end='')         # tell print not to add a newline
    print(line.strip())         # remove whitespace from both ends first
```
`line.strip()` is what you want 90% of the time, because you're about to process the
text anyway. Use `.rstrip('\n')` if trailing spaces matter.

### Printing
```python
print("hello")                  # hello
print("a", "b")                 # a b     (space-separated by default)
print("a", "b", sep='')         # ab
n = 5
print(f"n is {n}")              # f-strings: put any expression in { }
```

---
## THE TASK

Write `q01.py` that reads lines from stdin and prints each one prefixed by its
line number and a colon-space:

```
1: first line
2: second line
```

Numbering starts at **1**.

Run as: `./q01.py < input.txt`  (or `python3 q01.py < input.txt`)

---
## HINTS
<details><summary>Hint 1</summary>
Keep a counter, or use `enumerate`:
```python
for i, line in enumerate(sys.stdin, 1):
```
`enumerate(x, 1)` gives you `(1, first), (2, second), ...`
</details>

## CHECK
```sh
./test.sh
./test.sh solution
cat solution/EXPLANATION.md
```
