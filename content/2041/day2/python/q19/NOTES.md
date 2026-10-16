# Notes — the shell pipelines, as one Python program

Everything the Day-2 shell questions did with `cut | sort -u | uniq -c` is a dict here.
The translation is worth internalising in both directions.

## Parsing the record
```python
course, zid, name, prog, sex = line.rstrip('\n').split('|')
name = name.rstrip()
surname, given = name.split(', ')
first = given.split()[0]
```
* `split('|')` gives exactly 5 fields — unpack them by name.
* **`name.rstrip()`** removes the padding. In shell you dodged it with `[^ ]+`; in
  Python you strip it explicitly. Forget it and every surname carries trailing spaces
  into your output.
* `given.split()[0]` is the first given name — index 0 of the words after the comma.

## The shell → Python dictionary
| shell | python |
|---|---|
| `cut -d'\|' -f2,3 \| sort -u` | a `dict` keyed by zid |
| `sort \| uniq -c`             | `counts[k] = counts.get(k, 0) + 1` |
| `sort -k1,1rn -k2,2`          | `sorted(items, key=lambda kv: (-kv[1], kv[0]))` |
| `sort -u` on a field          | a `set` |
| "distinct students per X"     | a `dict` of **sets** |

**"Dedupe on the student, count on something else" becomes a dict of sets.**
```python
courses_of = {}            # zid -> set of courses
courses_of.setdefault(zid, set()).add(course)
```
Adding the same course twice is a no-op, which is what `sort -u` was doing.

## The three reports
* **Enrolments per course** — a plain count dict, sorted `(-count, course)`.
* **Students in most courses** — `len(courses_of[zid])`, sorted `(-n, zid)`, first 3.
  Storing `names[zid] = f"{first} {surname}"` as you parse means the report is a lookup.
* **Shared first names** — group zIDs by first name in a **dict of sets**
  (`by_first[first].add(zid)`), then keep the entries with more than one zid.
  A set is essential: `Ian Thorpe` has three records but is one student.

## The recurring sort key
```python
key=lambda kv: (-kv[1], kv[0])
```
Count descending, name ascending. It appears three times in this program. If you find
yourself writing it repeatedly, that is a sign you have understood the pattern — it
really is the answer to almost every ordering requirement in this course.

## Formatting
```python
print(f"  {course} {n}")
print(f"  {zid} {name} ({n} courses)")
print(f"  {first}: {', '.join(sorted(zids))}")
```
Two-space indents, the parentheses, the `: ` and `, ` — transcribe them from the sample.
`', '.join(sorted(zids))` — zIDs are strings here, so `sorted` gives ascending order and
`join` works directly.

## Edge cases
* `Thorpe, Ian Augustus` (3383025) has 3 records → 3 courses. `Thorpe, Ian Fredrick`
  (3371161) is a different student who shares the first name **and** the surname.
* `Wang, Wei` ×2 are two students with an identical full name — keying anything by name
  instead of zid merges them and breaks the counts.
* "(3 courses)" is printed even when N is 1 — no pluralisation logic. Check the spec
  before adding any.
* Ties in "most courses": several students have 2, broken by zID ascending.
