# Q20 explanation

```python
k = int(sys.argv[1]) if len(sys.argv) > 1 else 2

pairs = set()
for line in sys.stdin:
    fields = line.rstrip('\n').split('|')
    pairs.add((fields[0], fields[1]))

counts = {}
for course, zid in pairs:
    counts[zid] = counts.get(zid, 0) + 1

for zid in sorted((z for z in counts if counts[z] == k), key=int):
    print(zid)
```

## The stage-by-stage mapping
| pipeline | python |
|---|---|
| `cut -d'\|' -f1,2` | `fields[0], fields[1]` |
| `sort -u`          | `pairs = set()` of tuples |
| `cut -d'\|' -f2`   | `for course, zid in pairs` — unpack, use the zid |
| `sort \| uniq -c`  | `counts[zid] = counts.get(zid, 0) + 1` |
| `grep -E '^ *2 '`  | `if counts[z] == k` |
| `sed -E 's/^ *[0-9]+ //'` | **nothing** |
| `sort -n`          | `key=int` |

## Two stages disappear
The `sed` exists only to undo `uniq -c`'s text formatting. In Python the count lives in
a dict value, never in a string, so there is nothing to strip.

That's the general shape of these translations: **a pipeline passes text, so it needs
extra stages to serialise and re-parse; Python passes structures, so those stages have
no counterpart.** Expect a 7-stage pipeline to become 4 conceptual steps.

## A set of tuples is `sort -u` on a compound key
```python
pairs.add((fields[0], fields[1]))
```
Tuples are hashable, so the set deduplicates `(course, zid)` combinations — exactly what
`cut -f1,2 | sort -u` did. If a student were listed twice in the same course, both the
pipeline and this code count it once.

Dropping the set and counting records directly would inflate the counts and change the
answer. It's the single most important stage in the pipeline, and the easiest to skip
when translating from a mental impression instead of stage by stage.

## `key=int` is `sort -n`
`counts` keys are strings. `sorted(...)` alone is alphabetical (`sort`); `key=int` makes
it numeric (`sort -n`). Here all zIDs are 7 digits so both give the same order — but the
pipeline said `-n`, so the translation says `key=int`. Translate the instruction, not the
coincidence.

## The empty case
`./q20.py 9` — the generator yields nothing, the `for` body never runs, nothing is
printed. No `if` needed. Check whether the natural code already handles a spec's edge
case before writing a branch for it.

## `int(sys.argv[1]) if len(sys.argv) > 1 else 2`
The optional-argument idiom. The `len` check short-circuits before `sys.argv[1]` is
touched, so a missing argument can't raise.
