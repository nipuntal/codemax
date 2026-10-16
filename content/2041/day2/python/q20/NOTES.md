# Notes — translating a pipeline stage by stage

The exam asks this in both directions: "write the Python equivalent of this pipeline"
and "write the pipeline equivalent of this Python". Do it **mechanically**, one stage at
a time — do not read the pipeline, form an impression, and write what you think it does.

## Stage by stage
| shell stage | what it does | python |
|---|---|---|
| `cut -d'\|' -f1,2` | keep `COURSE\|ZID` | `parts = line.split('\|'); course, zid = parts[0], parts[1]` |
| `sort -u`          | distinct (course, zid) pairs | `pairs = set()` … `pairs.add((course, zid))` |
| `cut -d'\|' -f2`   | just the zid | iterate the set, take `[1]` |
| `sort \| uniq -c`  | count per zid | `counts[zid] = counts.get(zid, 0) + 1` |
| `grep -E '^ *2 '`  | keep count == 2 | `if n == k` |
| `sed -E 's/…//'`   | strip the count | (nothing — you never had a count prefix) |
| `sort -n`          | numeric order | `sorted(zids, key=int)` |

Two stages **vanish** in Python: the `sed` that strips `uniq -c`'s padding has no
counterpart, because you never built a padded text line in the first place. That's
normal — a pipeline carries data as *text*, so it needs stages that re-parse it.
Python carries data as *structures*, so those stages disappear.

## `sort -u` on pairs → a set of tuples
```python
pairs = set()
pairs.add((course, zid))
```
Tuples are hashable, so a set of them is exactly `sort -u` over two joined fields.
**This is the standard translation of "dedupe on a compound key".**

Then count:
```python
counts = {}
for course, zid in pairs:
    counts[zid] = counts.get(zid, 0) + 1
```
Note this counts *distinct pairs* per zid, which is what `sort -u` guaranteed.

Equivalently, a dict of sets:
```python
courses_of.setdefault(zid, set()).add(course)
...  len(courses_of[zid])
```
Same answer, one structure instead of two. Either is fine.

## `sort -n` → `key=int`
```python
sorted(zids, key=int)
```
The zIDs are strings. `sorted(zids)` is alphabetical (`sort`), `sorted(zids, key=int)`
is numeric (`sort -n`). With fixed-width 7-digit IDs they agree — but the pipeline said
`-n`, so the translation says `key=int`. **Translate what's written, not what happens to
work on this data.**

## The `k` argument
```python
k = int(sys.argv[1]) if len(sys.argv) > 1 else 2
```
The standard optional-argument idiom. `len(sys.argv) > 1` is the guard that stops
`sys.argv[1]` raising.

## Edge cases
* `k = 9` → no student qualifies → print nothing. A `for` over an empty list does that
  by itself; no `if` required.
* `k = 1` → students in exactly one course.
* A student appearing twice in the same course would be deduped by the pair-set — that
  is what the pipeline's `sort -u` was for, so your translation must keep it.
* Output must be the **zid only**, one per line, no count.

## Verify against the real thing
You have the pipeline. Run both and `diff` them:
```sh
diff <(./q20.py < enrollments.txt) \
     <(cut -d'|' -f1,2 < enrollments.txt | sort -u | cut -d'|' -f2 |
       sort | uniq -c | grep -E '^ *2 ' | sed -E 's/^ *[0-9]+ //' | sort -n)
```
No output means they agree. Do it on `more_enrollments.txt` too — a translation that
works on 16 records and fails on 184 usually got the dedup stage wrong.
**When the question hands you a reference implementation, use it as your test oracle.**
