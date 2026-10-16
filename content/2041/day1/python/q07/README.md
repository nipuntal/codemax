# Python Q7 — formatted output  (basics)

**Difficulty:** ⭐⭐ · **Target time:** 6 min

---
## LEARN FIRST

Exam questions specify output format *exactly*. This is where the marks live.

### The format spec: `f"{value:FORMAT}"`
```python
n = 42
x = 3.14159
s = "cat"

f"{n:5}"        "   42"      width 5, numbers right-aligned
f"{n:<5}|"      "42   |"     left align
f"{n:>5}|"      "   42|"     right align
f"{n:^5}|"      " 42  |"     centre
f"{n:05}"       "00042"      zero-pad
f"{x:.2f}"      "3.14"       2 decimal places
f"{x:8.3f}"     "   3.142"   width 8, 3 decimals
f"{s:8}|"       "cat     |"  strings LEFT-align by default
f"{s:>8}|"      "     cat|"
f"{n:3d}"       " 42"        explicit integer
f"{p:.1%}"      "45.0%"      percentage (multiplies by 100)
```

**Numbers right-align by default, strings left-align by default.** That trips
everyone up once.

### Percentages
```python
frac = 9 / 20
f"{frac:.1%}"           # "45.0%"
f"{frac * 100:.1f}%"    # "45.0%"  -- same thing, more explicit
```

### The older `%` style (you'll see it in course notes)
```python
"%d lines, %.2f avg" % (n, x)
"%-10s %5d" % (name, mark)
```
Equivalent. f-strings are clearer — use those, but be able to read `%`.

---
## THE TASK

`marks.txt` has lines of the form `NAME MARK` (whitespace separated).

Write `q07.py` that prints a table:

* the name **left-aligned in a field of width 12**
* the mark **right-aligned in a field of width 4**
* then a space and a bar of `*` characters, one `*` per full 10 marks

Then a final line:
```
average      MM.M
```
with the average left-aligned in width 12 and printed to **1 decimal place**,
right-aligned in width 4.

Example row: `Alice          72 *******`

Run as: `./q07.py < marks.txt`

---
## HINTS
<details><summary>Hint 1</summary>
`f"{name:<12}{mark:>4} {'*' * (mark // 10)}"`
</details>
<details><summary>Hint 2</summary>
`"*" * 7` gives `"*******"` — multiplying a string repeats it.
</details>

## CHECK
```sh
./test.sh
```
