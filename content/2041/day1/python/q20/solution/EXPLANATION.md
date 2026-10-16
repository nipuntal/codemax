# Python Q20 explanation

## The data structures (decided before any code was written)
```python
by_student = {}     # zid    -> list of marks
by_course  = {}     # course -> list of marks
failed     = set()  # zids with any mark < 50
```
One pass over the file fills all three. Everything the report needs is then a
question about these three objects. **Spend the first minute here, not on syntax.**

## Reading
```python
        with open(sys.argv[1]) as f:
            lines = f.readlines()
```
`readlines()` because we want to skip the header with a slice:
```python
    for line in lines[1:]:
```
`lines[1:]` = everything from index 1 on — this is `tail -n +2`.

(Streaming alternative: `next(f)` to discard the header, then loop over `f`.)

```python
        zid, course, term, mark = line.split(',')
```
Four fields, four names. `term` is unused; naming it anyway documents the format.
You could write `zid, course, _, mark` to signal that.

## The three reports

```python
    top = sorted(by_student.items(), key=lambda kv: (-avg(kv[1]), kv[0]))[:3]
```
The tuple-key trick again: average descending, zid ascending for ties, take 3.
`kv[1]` is the list of marks, so `avg(kv[1])` computes on the fly.

```python
    for course in sorted(by_course):
```
Iterating a dict gives keys; `sorted` puts them in alphabetical order as specified.

```python
    print(f"  {course} {avg(marks):.1f} ({len(marks)} students)")
```
Every literal character here — the two leading spaces, the parentheses, the word
`students` — comes straight from the spec. Copy them; don't paraphrase.

```python
    print(f"Failed at least one course: {', '.join(sorted(failed))}")
```
`sorted(failed)` because sets have no order.

## The `avg` helper
```python
def avg(xs):
    return sum(xs) / len(xs)
```
Three characters at each call site instead of eleven, and it makes the sort key
readable. **When you write the same expression three times, make it a function** —
markers notice, and so do you when debugging.

## Error handling
Both failure modes print the same usage message, so the `try`/`except IOError` block
repeats it. A tidier version:
```python
def die():
    print(f"Usage: {sys.argv[0]} <csvfile>", file=sys.stderr)
    sys.exit(1)
```
Either is fine. Don't let tidiness cost you time in the exam.

## What a marker checks
* exact output format (indentation, decimal places, punctuation)
* header skipped
* correct tie-breaking
* stderr + exit 1 on bad usage

Logic and formatting are worth about the same. Diff your output.
