# Q8 Walkthrough — Enrolment Report

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### Grouping: a dict whose values are collections
Counting used `dict[key] = number`. **Grouping** uses `dict[key] = a container`.

```python
by_course = {}
by_course.setdefault(course, {})[zid] = display_name
```
`d.setdefault(k, default)` returns `d[k]` if it exists, otherwise **inserts** `default`
and returns that. So the chained `[zid] = ...` always has a dict to write into.

The long form, if `setdefault` feels opaque:
```python
if course not in by_course:
    by_course[course] = {}
by_course[course][zid] = display_name
```
Identical. Write whichever you can produce without hesitating.

`collections.defaultdict(dict)` is a third spelling and also fine.

### Why a dict of **dicts**, not a dict of lists
The spec says **distinct students**. Keying the inner container by `zid` means a
student enrolled twice in the same course collapses automatically — the same job
`sort -u` does in a pipeline.

Choose the inner container from the spec:
| spec says | inner container |
|---|---|
| "how many" | a counter (`int`) |
| "all of them, duplicates kept" | a `list` |
| "distinct" | a `set`, or a `dict` if you need a value too |

Here you need distinctness **and** a display name per student → a dict keyed by zid.

### Two students, one name
`COMP3311` shows `Ian Thorpe, Ian Thorpe` — two *different* students (3383025 and
3371161) who share a first name and surname. Keying by zid keeps them both; keying by
name would silently merge them and report 2 instead of 3.

**Key on the identifier, display the name.** This is the same lesson as Q7, from the
other direction.

### Peeling the name apart
```python
surname, given = name.rstrip().split(', ')
first = given.split()[0]
```
* `.rstrip()` removes the field's trailing padding — **do this before anything else
  touches the given names**, or the padding rides along.
* `split(', ')` on the literal comma-space gives exactly two parts.
* `given.split()[0]` is the first word after the comma, ignoring middle names.

### Sorting dict keys and values
```python
for course in sorted(by_course):      # iterating a dict yields its KEYS
    names = sorted(students.values())  # .values() gives the display names
```
`sorted(d)` is `sorted(d.keys())`. `d.values()` and `d.items()` are the other two views.

`', '.join(names)` — the separator goes **between** elements, so n names give n−1
commas and there is no trailing one.

---
## PART 2 — THE APPROACH

1. **Data structure first:** "for each course, the set of students, each with a display
   name." → `{course: {zid: "First Last"}}`. One sentence, then the code follows.
2. One loop to gather: split, build the display name, store under `[course][zid]`.
3. One loop to report: sorted courses, sorted names, formatted line.

---
## PART 3 — THE SOLUTION

```python
by_course = {}

for line in sys.stdin:
    course, zid, name, plan, sex = line.rstrip('\n').split('|')
    surname, given = name.rstrip().split(', ')
    first = given.split()[0]
    by_course.setdefault(course, {})[zid] = f"{first} {surname}"

for course in sorted(by_course):
    students = by_course[course]
    print(f"{course} {len(students)} student(s): {', '.join(sorted(students.values()))}")
```

`len(students)` is the number of distinct zids — the count and the name list come from
the same structure, so they can never disagree.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`name.rstrip()`** — without it every surname in your output drags trailing spaces,
  and `', '.join` makes them visible. This is the most common failure here.
* **Two `Ian Thorpe`s in COMP3311, and two `Wei Wang`s in COMP3331.** Both pairs are
  distinct students with identical display names. If either count comes out one lower
  than the expected output, you keyed the inner container by name instead of zid.
  Note the output really does print the same name twice — that is correct, not a bug.
* **`student(s)` is not pluralised** — the spec shows the literal string for counts of
  1, 2 and 3. Don't invent pluralisation logic; transcribe the format.
* **`sorted(students.values())`** — the names, not the zids.
* `', '.join(...)` for comma-space. Building it with a loop and `+ ", "` leaves a
  trailing separator.
* The unpack `course, zid, name, plan, sex = ...` documents the format and fails loudly
  on a malformed line. `sex` and `plan` are unused; naming them anyway is deliberate.
