# Module 37 &nbsp;·&nbsp; Python + Psycopg2

## A report with several parts


## LEARN FIRST

Nothing new here. This module is about **assembling** what you already have,
because real exam questions are never one query.

### The shape of a multi-part question

Almost every Python question in this course looks like:

```
1. check the arguments
2. look something up; bail out with a message if it is not there
3. print a header built from that lookup
4. run the main query
5. print its rows in a specified format
6. maybe print a summary line
```

Each step is small. The mistake is trying to do it all in one query, or all in
one pass.

### Work outside-in

Get the **scaffolding** right before the hard query:

```python
def main():
    if len(sys.argv) != 2: print(USAGE); return
    course = sys.argv[1]
    print(f"{course}")            # header, real
    print("  placeholder")        # a fake row
    print("  0 total")            # a fake summary
```

Run it. The shape is right. **Now** replace the placeholders with real queries,
one at a time, running it after each.

If you run out of time you still have something that runs and produces most of
the expected format — which scores. A half-written query that will not compile
scores nothing.

### Summary lines from data you already have

```python
rows = cur.fetchall()
for ... in rows:
    print(...)
print(f"{len(rows)} classes")
```

`len(rows)` beats a second `count(*)` query when you are already holding the
list. Module 29 and 33 both used this.

### Dividing safely

```python
pct = a / b * 100 if b else 0
```

Any division whose denominator came from the data needs a guard.
`ZeroDivisionError` is caught by the driver's `except Exception`, which prints
`Internal Error:` and re-raises — an ugly traceback instead of output.

### Rounding at the last moment

```python
print(f"{pct:.1f}%")
```

Do the arithmetic at full precision and round **only** in the format string.
Rounding early and then combining gives different answers from the expected
output — the same point module 17 made about `having` versus display.

---

## THE TASK

A report on one course.

```
$ ./q37.py COMP1927
COMP1927
  classes:  10 across 3 days
  rooms:    8 rooms, 4 types
  hours:    16 total, 1.6 average
  students: 255 enrolled, 26.1 per class
```

Rules, exactly — each label is left-aligned in **width 10** after two spaces:

- line 1: the course code
- `classes:` — `N across D days` (distinct days)
- `rooms:` — `R rooms, T types` (distinct rooms, distinct room types)
- `hours:` — `H total, A average` — the average to **one** decimal place
- `students:` — `S enrolled, P per class` — `S` is the number of **distinct**
  students, `P` the average enrolment per class, to one decimal place
- unknown course → `No such course` and nothing else
- wrong argument count → `USAGE`

## Hints

<details><summary>Hint 1</summary>

Three queries is plenty: one over `Classes`, one joining `Classes` to `Rooms`,
one joining `Classes` to `Attends`. Get each line working before starting the
next.
</details>

<details><summary>Hint 2</summary>

The first query is also your existence check — it is an aggregate, so test
whether the count is 0 (modules 27 and 30).
</details>

<details><summary>Hint 3</summary>

"Per class" is enrolments divided by classes — guard the division.
</details>
