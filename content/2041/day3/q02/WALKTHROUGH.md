# Q2 Walkthrough — Winners By Country

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### Splitting a record
```python
fields = line.rstrip('\n').split('|')
country = fields[4]
```
* `.rstrip('\n')` **first**. Lines from `sys.stdin` keep their newline, and here it
  would end up glued to the birth year (field 6). It doesn't affect field 5 in this
  question — but strip anyway, because the habit is what saves you when it does matter.
* `split('|')` — a plain string split, no regex. The `|` is not special to `str.split`.
* **`cut -f5` is `fields[4]`.** `cut` numbers from 1, Python from 0. Write the
  conversion down; this off-by-one is the most common translation error there is.

You can also unpack:
```python
award, year, name, gender, country, birth = line.rstrip('\n').split('|')
```
Clearer, and it raises loudly if a line doesn't have 6 fields. Use it when the field
count is fixed and known.

### The counting idiom
```python
counts[country] = counts.get(country, 0) + 1
```
`counts.get(k, 0)` returns the existing count or `0` for a key you've never seen.
`counts[k] + 1` raises `KeyError` the first time. This three-word idiom is the Python
translation of `sort | uniq -c`, and it appears in almost every Python question in
this course.

`collections.Counter(...)` does the same thing and is allowed. Know both.

### The sort key — the single most valuable line in the course
```python
sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
```
* `counts.items()` yields `(country, count)` pairs, so `kv[0]` is the country and
  `kv[1]` the count.
* A **tuple key** compares left to right: Python looks at the first element, and only
  when those tie does it look at the second.
* `-kv[1]` makes the count descend **while the country still ascends**.

Why not `reverse=True`? Because that reverses the *whole* comparison, so ties would come
out in reverse alphabetical order. **Negate the numeric part; never reverse the whole
sort when you have a tie-break.**

### Slicing the top N
```python
[:5]
```
Slicing past the end is safe — a 3-element list `[:5]` gives 3 elements, no error.
That's `head -n 5`.

---
## PART 2 — THE APPROACH

1. **Pick the data structure first.** "How many awards per country" → a dict from
   country to a count. One sentence, then the code writes itself.
2. One loop to gather: split each line, take field 5, increment.
3. One pass to report: sort the items, take 5, print.

Resist doing both in one loop. Gather, then report.

---
## PART 3 — THE SOLUTION

```python
counts = {}
for line in sys.stdin:
    fields = line.rstrip('\n').split('|')
    country = fields[4]
    counts[country] = counts.get(country, 0) + 1

for country, n in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:5]:
    print(f"{country} {n}")
```

The `for country, n in ...` unpacks each `(country, count)` pair straight into two
names — cleaner than `kv[0]` / `kv[1]` throughout the loop body.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **The tie-break is not hypothetical here.** China, Italy and Japan all have 59.
  Without `kv[0]` in the key those three come out in whatever order the dict happened
  to be built in — your answer would pass on your machine and fail on the marker's.
  Run it with `key=lambda kv: -kv[1]` and watch the top three shuffle.
* `fields[4]` not `fields[5]`. Country is the 5th field.
* Forgetting `.rstrip('\n')` is invisible here and fatal in the next question that
  reads the last field.
* `print(f"{country} {n}")` — exactly one space. Read the sample.
* The shell equivalent, for comparison:
  ```sh
  cut -d'|' -f5 | sort | uniq -c | sort -k1,1rn -k2,2 | head -n 5 | sed -E 's/^ *([0-9]+) (.*)/\2 \1/'
  ```
  Note the pipeline needs an extra stage to undo `uniq -c`'s text formatting. Python
  keeps the count as a number, so that stage has no counterpart. **Pipelines pass text
  and must re-parse it; Python passes structures.**
