# Q6 Walkthrough — Same Task in Python (exam Q3, 9 marks)

> **Read this after you have attempted the question.**

The exam deliberately asks the *same* task twice. The marks are for showing you can
move between the two models, so learn the mapping, not two separate programs.

---
## PART 1 — TEACH

### The shell → Python translation table
| pipeline stage | Python |
|---|---|
| `grep '\|M$'`     | `if gender == 'M':` |
| `cut -d'\|' -f3`  | `line.split('\|')[2]` |
| `cut -d',' -f1`   | `name.split(',')[0]` |
| `sort -u`         | a `set`, then `sorted(...)` |
| `sort`            | `sorted(...)` |
| `sort -n`         | `sorted(..., key=int)` |
| `uniq -c`         | `d[k] = d.get(k, 0) + 1` |
| `head -n N`       | `xs[:N]` |
| `wc -l`           | `len(lines)` |

**`cut -fN` is `split(...)[N-1]`.** Write the off-by-one down every single time.

### Unpacking beats indexing
```python
course, zid, name, plan, gender = line.rstrip('\n').split('|')
```
Five fields, five names. Compared with `fields[2]` and `fields[4]` scattered through
the code, this:
* documents the format in one place
* makes `gender == 'M'` read like the spec
* **raises loudly** if a line doesn't have exactly 5 fields, instead of silently
  reading the wrong column

Use it whenever the field count is fixed and known. Use `fields = line.split('|')` when
it isn't.

### `.rstrip('\n')` is not optional here
Gender is the **last** field. Without the strip it is `'M\n'`, and `gender == 'M'` is
**False for every line** — your program prints nothing.

This is the single most likely way to score zero on this question. Whenever you compare
against the last field of a line, strip first.

| method | on `"  hi  \n"` |
|---|---|
| `rstrip('\n')` | `"  hi  "` |
| `rstrip()`     | `"  hi"` |
| `strip()`      | `"hi"` |

`rstrip('\n')` removes exactly the newline and nothing else. Prefer it when the spec
says "the line" — it can't silently damage data.

### A `set` is `sort -u`
```python
surnames = set()
surnames.add(x)          # adding a duplicate is a no-op
sorted(surnames)         # a sorted LIST of the members
```
**Sets have no order.** Never print a set directly; always `sorted()` it. Iterating a
set gives an order that is stable within one run and meaningless across inputs.

### `split(',')[0]`
`"Thorpe, Ian Augustus             ".split(',')` → `['Thorpe', ' Ian Augustus       ']`.
Element 0 is the surname, and the trailing padding lives in element 1 where it can't
hurt you. Same fortunate structure as the shell version.

`.split(',', 1)` (max 1 split) is more precise if a name could contain two commas.

---
## PART 2 — THE APPROACH

1. **Data structure first:** "the set of surnames of male students." One sentence.
   A `set`, because the spec says each surname once.
2. **One loop to gather:** split the line, test the gender, add the surname.
3. **One loop to report:** `for s in sorted(surnames): print(s)`.

That gather/report split is the shape of nearly every Python question in this course.
Resist merging them.

---
## PART 3 — THE SOLUTION

```python
import sys

surnames = set()
for line in sys.stdin:
    course, zid, name, plan, gender = line.rstrip('\n').split('|')
    if gender == 'M':
        surnames.add(name.split(',')[0])

for surname in sorted(surnames):
    print(surname)
```

Nine lines, and every one maps to a stage of the Q5 pipeline.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`.rstrip('\n')` before comparing the last field.** Miss it and you print nothing.
* **`sorted()` the set before printing.** Printing a set gives `{'Wang', 'Carey', ...}` —
  braces and all — or, if you loop over it, an arbitrary order.
* **`Carey, Mary` is male in this data.** If you filtered on the given name instead of
  field 5, you'd drop it. Read the field, not the human meaning.
* **`Klum, Mary` is female** and must not appear.
* `split('|')` needs no escaping — `str.split` takes a *literal* string, not a regex.
  (If you used `re.split` you *would* need `\|`.)
* The spec allows any standard module, so `sys` is enough; nothing here needs `re`.
* If a line had fewer than 5 fields, unpacking raises `ValueError`. The spec guarantees
  5, so that's a feature — a malformed line fails loudly rather than silently
  misreading a column.
