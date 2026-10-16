# Python Q12 explanation

```python
    by_course.setdefault(course, []).append((name, mark))
```
`d.setdefault(k, default)` returns `d[k]` if it exists, otherwise **inserts**
`default` and returns that. So the chained `.append(...)` always has a list to work
with. One line replaces the three-line "if not in" dance.

```python
    courses_of.setdefault(name, set()).add(course)
```
Same pattern with a **set**, because we only care about *distinct* courses per
student. If the file listed a student twice for one course, a set wouldn't
double-count them.

```python
    avg = sum(m for _, m in pairs) / len(pairs)
```
* `for _, m in pairs` unpacks each `(name, mark)` tuple.
* `_` is the conventional name for "a value I'm deliberately ignoring".
* It's a generator expression, so no intermediate list is built.

```python
    top_name, top_mark = sorted(pairs, key=lambda p: (-p[1], p[0]))[0]
```
Sort by mark descending, name ascending, then take element `[0]`. In COMP2521 Eve and
Bob both scored 91 — the `p[0]` tiebreak puts **Bob** first.

Why not `max(pairs, key=lambda p: p[1])`? Because `max` returns the *first* maximum in
list order, which is whatever order the file happened to be in — not alphabetical.
When ties are specified, **sort, don't max**.

```python
multi = sorted(n for n in courses_of if len(courses_of[n]) > 1)
```
Iterating a dict gives keys; the `if` filters them; `sorted` orders them.
Equivalent, arguably clearer:
```python
multi = sorted(name for name, cs in courses_of.items() if len(cs) > 1)
```

```python
print(f"... {', '.join(multi)}")
```
`", ".join(...)` for the comma-space list. Remember join needs strings — here they
already are.
