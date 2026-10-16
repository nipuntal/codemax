# Python Q2 — command-line arguments  (basics)

**Difficulty:** ⭐ · **Target time:** 4 min

---
## LEARN FIRST

```python
import sys
sys.argv          # a LIST of strings
sys.argv[0]       # the program name
sys.argv[1]       # first real argument
sys.argv[1:]      # all real arguments (a list)
len(sys.argv)     # count INCLUDING the program name
```

Shell ↔ Python translation table — memorise this:

| shell | python |
|---|---|
| `$0`  | `sys.argv[0]` |
| `$1`  | `sys.argv[1]` |
| `$#`  | `len(sys.argv) - 1` |
| `"$@"`| `sys.argv[1:]` |

### Arguments are always STRINGS
```python
n = sys.argv[1]           # "5"  -- a string!
n = int(sys.argv[1])      # 5    -- now a number
```
`"5" + 1` is a TypeError. `"5" * 3` is `"555"`. Convert explicitly.

### The usage check
```python
if len(sys.argv) != 3:
    print(f"Usage: {sys.argv[0]} <a> <b>", file=sys.stderr)
    sys.exit(1)
```
`file=sys.stderr` is the Python equivalent of shell's `1>&2`.
`sys.exit(1)` is `exit 1`.

### Slicing (works on lists AND strings)
```python
x = [10, 20, 30, 40, 50]
x[0]      # 10
x[-1]     # 50   last
x[1:3]    # [20, 30]   from 1 up to BUT NOT INCLUDING 3
x[2:]     # [30, 40, 50]
x[:2]     # [10, 20]
```

---
## THE TASK

Write `q02.py` that takes any number of integer arguments and prints:
```
count: C
sum: S
max: M
min: M
```

If there are **no** arguments, print `Usage: ./q02.py <int>...` to **stderr**
and exit with status 1.

Test invocation: `./q02.py 4 17 3 42 8`

---
## HINTS
<details><summary>Hint 1</summary>
`nums = [int(a) for a in sys.argv[1:]]` — a list comprehension converts them all.
</details>
<details><summary>Hint 2</summary>
`sum(nums)`, `max(nums)`, `min(nums)`, `len(nums)` are all builtins.
</details>

## CHECK
```sh
./test.sh
./q02.py ; echo $?     # should print usage to stderr and give 1
```
