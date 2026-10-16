# Q19 explanation

## The four structures, decided before any code
```python
course_counts = {}   # course -> number of enrolment records
courses_of    = {}   # zid    -> SET of courses
names         = {}   # zid    -> "First Last"
by_first      = {}   # first  -> SET of zids
```
One pass fills all four; the three reports are then just questions about them.
Spending the first minute naming these is what makes the rest fall out.

## Parsing
```python
    course, zid, name, prog, sex = line.rstrip('\n').split('|')
    surname, given = name.rstrip().split(', ')
    first = given.split()[0]
```
* Five fields, unpacked into five names. `prog` and `sex` are unused but naming them
  documents the format (`_` would also do).
* **`name.rstrip()`** removes the field's trailing padding. This is the Python
  equivalent of the shell questions' `[^ ]+` trick — there you wrote a regex that
  couldn't absorb the spaces; here you delete them. Skip it and every surname in your
  output drags ten spaces behind it.
* `given.split()[0]` takes the first word after the comma — the first given name,
  ignoring however many middle names follow.

## Why sets, not counters
```python
    courses_of.setdefault(zid, set()).add(course)
    by_first.setdefault(first, set()).add(zid)
```
This is `sort -u` in Python. `Thorpe, Ian Augustus` appears in three records; the set
records three *courses*. `Ian` appears in four records across two students; the set
records two *zids*.

Using a counter instead would report `Ian` as shared by 4 people. **When the shell
answer needed `sort -u`, the Python answer needs a set.**

## Keying by zid, never by name
`Wang, Wei` occurs twice with different zIDs — two students, one name. Every dict here
is keyed by `zid` (or maps *to* a set of zids), so they stay distinct. Keying by name
would silently merge them and change `students: 10` to 9.

## The sort key, three times
```python
key=lambda kv: (-kv[1], kv[0])           # count desc, course asc
key=lambda kv: (-len(kv[1]), kv[0])      # #courses desc, zid asc
```
Tuple keys compare left to right; negating the numeric part reverses only that part.
`reverse=True` would flip the tie-break too and give you the last course/zid
alphabetically instead of the first.

## `sorted(by_first)` then filter
```python
for first in sorted(by_first):
    if len(zids) > 1:
```
Iterating a dict yields keys; `sorted` puts them in alphabetical order as specified.
Filtering inside the loop is clearer than building a filtered list first.

## Formatting
`  {zid} {names[zid]} ({len(cs)} courses)` — two-space indent, the parentheses, the
word `courses` even when the count is 1. The spec shows no pluralisation, so don't
invent any. Transcribe the sample.
