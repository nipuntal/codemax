# Q37 Walkthrough — Award Statistics

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### Several statistics per group → a dict of dicts
Q8 grouped into a dict of dicts keyed by id. Here each group needs **five different
numbers**, so the natural value is a small record:

```python
stats[award] = {'n': 0, 'f': 0, 'first': year, 'last': year, 'oldest': age}
```
Then one pass updates all five:
```python
s = stats[award]
s['n'] += 1
s['first'] = min(s['first'], year)
s['last']  = max(s['last'],  year)
s['oldest'] = max(s['oldest'], age)
```

**Bind `s = stats[award]` once.** Dicts are mutable and `s` is a *reference*, so
mutating `s` mutates the stored record. It's shorter and it makes the five updates read
as a group.

### Seeding running min/max correctly
```python
if award not in stats:
    stats[award] = {..., 'first': year, 'last': year, 'oldest': age}
```
The first record for an award **seeds** the min and max. Seeding with `0` would break
`max` (every year beats 0, but `min` would stay 0 forever); seeding with `None` would
need a special case in every update.

**Seed a running extremum from the first real value**, or use `float('inf')` /
`float('-inf')` as sentinels. Never 0.

### `min`/`max` as running accumulators
```python
s['first'] = min(s['first'], year)
```
Two-argument `min`/`max` is the standard way to maintain a running extremum in a single
pass, and it's clearer than an `if`.

### Counting a subset
```python
if gender == 'Female':
    s['f'] += 1
```
A conditional counter alongside the total. Note this is the **exact string** `Female` —
after `.rstrip('\n')` and with gender being field 4 (not the last), the newline isn't a
factor here, but the habit of stripping first still applies.

### Derived values
```python
age = year - int(birth)
```
Compute it as you read, then feed it to the running `max`. Storing every age and
computing the max at the end also works but keeps far more state for no benefit.

Both `year` and `birth` must be `int()`ed — `"2019" - "1991"` is a TypeError, and
comparing them as strings would silently give the wrong answer.

### Multi-line f-strings
```python
print(f"{award}: {s['n']} winners, {s['f']} female, "
      f"span {s['first']}-{s['last']}, oldest winner aged {s['oldest']}")
```
Adjacent string literals are concatenated by Python, so a long line can be split across
two — **each piece needs its own `f` prefix**. Forgetting the second `f` leaves literal
`{s['first']}` in your output.

Note the single quotes inside `{ }` because the f-string uses double quotes.

---
## PART 2 — THE APPROACH

1. **Data structure first:** "for each award, a record of five running values."
2. One pass: parse, derive `age`, seed on first sight, update all five.
3. One pass to report, `sorted(stats)` for alphabetical order.
4. The totals come from `total` and `len(stats)`.

---
## PART 3 — THE SOLUTION

```python
stats = {}
total = 0

for line in sys.stdin:
    award, year, name, gender, country, birth = line.rstrip('\n').split('|')
    year = int(year)
    age = year - int(birth)

    if award not in stats:
        stats[award] = {'n': 0, 'f': 0, 'first': year, 'last': year, 'oldest': age}
    s = stats[award]
    s['n'] += 1
    if gender == 'Female':
        s['f'] += 1
    s['first'] = min(s['first'], year)
    s['last'] = max(s['last'], year)
    s['oldest'] = max(s['oldest'], age)
    total += 1

for award in sorted(stats):
    s = stats[award]
    print(f"{award}: {s['n']} winners, {s['f']} female, "
          f"span {s['first']}-{s['last']}, oldest winner aged {s['oldest']}")

print(f"TOTAL: {total} winners across {len(stats)} awards")
```

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **Seed min/max from the first record**, not from 0.
* **`int()` both years** before subtracting or comparing.
* **`sorted(stats)`** for alphabetical award order.
* **The exact format** — the colon, the commas, `span YYYY-YYYY` with a hyphen and no
  spaces, `oldest winner aged N`. Transcribe it.
* **`len(stats)`** is the number of *distinct* awards, which is why a dict is the right
  structure — you get the count for free.
* Unpacking into six names fails loudly on a malformed line, which is a feature.
* `s = stats[award]` aliases the dict; mutating `s` really does update `stats`. If you
  copied it (`s = dict(stats[award])`) your updates would vanish.
