# Python Q19 — translating a shell pipeline into Python  (modules)

**Difficulty:** ⭐⭐⭐⭐ · **Target time:** 10 min

---
## LEARN FIRST

COMP2041 loves "here is a shell pipeline, write the Python equivalent". The
translation is mechanical once you know the table:

| shell | python |
|---|---|
| `cat f`               | `for line in open(f):` |
| `grep PAT`            | `if re.search(r'PAT', line):` |
| `grep -v PAT`         | `if not re.search(r'PAT', line):` |
| `grep -c PAT`         | a counter |
| `head -n N`           | `lines[:N]` |
| `tail -n N`           | `lines[-N:]` |
| `wc -l`               | `len(lines)` |
| `cut -d: -f2`         | `line.split(':')[1]` |
| `cut -d' ' -f3`       | `line.split()[2]`   (careful: fields are 1-based in cut, 0-based in Python!) |
| `tr 'A-Z' 'a-z'`      | `line.lower()` |
| `tr -d 'x'`           | `line.replace('x', '')` |
| `tr -cs 'a-zA-Z' '\n'`| `re.findall(r'[a-zA-Z]+', line)` |
| `sort`                | `sorted(lines)` |
| `sort -n`             | `sorted(lines, key=int)` |
| `sort -u`             | `sorted(set(lines))` |
| `uniq -c`             | the counting dict |
| `sed 's/a/b/g'`       | `re.sub(r'a', 'b', line)` or `line.replace('a','b')` |
| `sort \| uniq -c \| sort -rn` | `sorted(counts.items(), key=lambda kv: -kv[1])` |

**`cut -f2` is `split()[1]`.** Off-by-one between cut's 1-based fields and Python's
0-based lists is the most common translation error. Write the field number down.

### The general shape
```python
counts = {}
for line in sys.stdin:
    # the grep/cut/tr part, per line
    ...
for key, value in sorted(counts.items(), key=...):
    # the sort/uniq/head part, at the end
    print(...)
```
Per-line filters go in the loop; anything needing the *whole* input (sort, uniq,
count) happens after it.

---
## THE TASK

This shell pipeline finds the busiest days in a log:

```sh
grep -v '^#' log.txt |
cut -d' ' -f1 |
sort | uniq -c | sort -rn | head -n 3
```

Write `q19.py` that does the **same thing** in pure Python (no `subprocess`, no
shell), reading from stdin, and prints the result in the same `COUNT DATE` format
that `uniq -c` produces — except with **exactly one space** between them and no
leading padding:

```
5 2026-08-03
4 2026-08-01
3 2026-08-05
```

Ties are broken by date **ascending**.

Run as: `./q19.py < log.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Three steps: skip `#` lines, take field 1 with `line.split()[0]`, count into a dict.
</details>
<details><summary>Hint 2</summary>
`sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:3]` — count descending,
key ascending, first three. The tuple-key trick from Q11.
</details>

## CHECK
```sh
./test.sh
```
