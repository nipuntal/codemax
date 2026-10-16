# Day 3 · Q35 — Format A Table  ·  [python]  ·  ⭐⭐⭐ · 10 min

Write a Python program `q35.py` that reads pipe-separated records on stdin and prints
them as a table, with every column padded to the width of its **widest** entry
(including the header row), columns separated by two spaces, no trailing whitespace.

The first line of input is the header.

```
printf 'course|zid|name\nCOMP2041|3383025|Thorpe, Ian\nCOMP1511|3360379|Costner, Kevin Augustus\n' | ./q35.py
course        zid  name
COMP2041  3383025  Thorpe, Ian
COMP1511  3360379  Costner, Kevin Augustus
```

Numeric columns (every value, header aside, is a non-negative integer) must be
**right**-aligned; all others **left**-aligned.

```
./q35.py < table.psv
name    qty  price
apple    10      3
banana    5     12
fig     100      7
```

* Assume all rows have the same number of fields.
* Python only, reading stdin. No external programs.

```sh
./test.sh          # then read WALKTHROUGH.md
```
