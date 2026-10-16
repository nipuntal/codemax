# Python Q12 — grouping with a dict of lists  (control flow)

**Difficulty:** ⭐⭐⭐ · **Target time:** 8 min

---
## LEARN FIRST

Counting used `dict[key] = number`. **Grouping** uses `dict[key] = list`.

```python
groups = {}
for name, course in records:
    if course not in groups:
        groups[course] = []          # create the list the first time
    groups[course].append(name)
```
That "create it if missing" step is the whole trick. Three shortcuts:

```python
groups.setdefault(course, []).append(name)
```
```python
from collections import defaultdict
groups = defaultdict(list)
groups[course].append(name)          # the list appears automatically
```
Both are fine in the exam. `defaultdict(list)` is the cleanest — but the explicit
`if key not in d` version is the one to reach for if you're unsure, because you can
see exactly what it does.

### Then process each group
```python
for course in sorted(groups):
    names = groups[course]
    print(f"{course}: {len(names)} students, avg {sum(marks)/len(marks):.1f}")
```

### Nested dicts
```python
d = {}
d.setdefault(course, {})[name] = mark
```
Occasionally useful; usually a dict of lists is enough.

### Sets — for "distinct" questions
```python
s = set()
s.add(x)
len(s)                    # how many distinct
s1 & s2                   # intersection (in both)
s1 | s2                   # union
s1 - s2                   # difference (in s1 but not s2)
sorted(s)                 # a sorted list of the members
```

---
## THE TASK

`enrol.txt` has lines `COURSE NAME MARK`.

Write `q12.py` that prints, for each course in **alphabetical order**:
```
COURSE: N students, avg AA.A, top NAME (MARK)
```
`N` is the number of students, the average is to 1 decimal place, and `top` is the
highest-scoring student (ties broken alphabetically by name).

Then a final line:
```
students enrolled in more than one course: A, B, C
```
listing those names alphabetically, comma-space separated.

Run as: `./q12.py < enrol.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Two dicts: `by_course[course] = list of (name, mark)` and
`courses_of[name] = set of courses`.
</details>
<details><summary>Hint 2</summary>
Top student: `max(pairs, key=lambda p: (p[1], ...))` — but ties must go to the
**alphabetically first** name, so you can't just negate. Sort instead:
`sorted(pairs, key=lambda p: (-p[1], p[0]))[0]`.
</details>

## CHECK
```sh
./test.sh
```
