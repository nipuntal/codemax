# Python Q11 explanation

```python
    name, course, mark = line.split()
    students.append((name, course, int(mark)))
```
Unpack the three fields, convert the mark, store as a tuple. `int(mark)` matters — a
string mark would sort `"91"` before `"9"`… actually before `"88"`, alphabetically.
Silent wrong answer.

## The three keys

```python
key=lambda s: (-s[2], s[0])       # mark DESC, then name ASC
```
`s` is one student tuple. `s[2]` is the mark, `s[0]` the name. Negating the mark makes
high marks sort first while the name still sorts ascending. Eve(91) before Bob(91)?
No — B < E, so **Bob** comes first. Check the expected output and you'll see it.

```python
key=lambda s: (len(s[0]), s[0])   # short names first, ties alphabetical
```
`Bob`, `Eve`, `Hal` are all 3 letters, so the second element decides.

```python
key=lambda s: (s[1], -s[2])       # course ASC, mark DESC
```
Mixed directions in one key — this is exactly why you use `-value` instead of
`reverse=True`. `reverse=True` here would reverse the course order too.

## Why not `reverse=True`?
```python
sorted(students, key=lambda s: s[2], reverse=True)
```
gives marks descending, but ties would come out in **reverse** name order. The
negation trick keeps each part independent.

## For non-numeric descending
You can't negate a string. Sort twice, relying on stability:
```python
students.sort(key=lambda s: s[2])                  # secondary key first
students.sort(key=lambda s: s[1], reverse=True)    # then primary
```

## Unpacking in the for line
```python
for name, course, mark in sorted(...):
```
Each item is a 3-tuple, unpacked straight into three names. Cleaner than `s[0]`,
`s[1]`, `s[2]` all through the loop body.
