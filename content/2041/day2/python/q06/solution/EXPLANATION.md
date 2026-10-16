# Q6 explanation

```python
with open(sys.argv[1]) as f:
    lines = f.read().splitlines()

lines.sort(key=lambda l: (len(l.split()), l))

for line in lines:
    print(line)
```

## The tuple key
```python
key=lambda l: (len(l.split()), l)
```
Tuples compare left to right: Python looks at the word counts, and only when they are
equal does it compare the lines themselves. That gives "fewest words first, ties
alphabetical" in one expression.

Trace the ties in the data:
* `one`, `two` — both 1 word → `"one" < "two"` → one, two
* `apple zebra`, `zebra apple` — both 2 → `"apple zebra" < "zebra apple"`
* `a a a a`, `b b b b` — both 4 → a before b

If your output has these pairs in the wrong order, your key has only one element.

## `splitlines()` instead of `readlines()`
```python
f.read().splitlines()     # ['one', 'two', ...]      no newlines
f.readlines()             # ['one\n', 'two\n', ...]  newlines kept
```
Stripping first means the sort key is exactly the visible text, with no `\n` quietly
participating in the comparison. Then `print(line)` supplies the newline.

With `readlines()` you'd need `print(line, end='')` **and** you'd be sorting strings
that end in `\n`. It happens to give the same answer here (because `\n` sorts before
printable characters), but "happens to" is not a reason.

## `.sort()` vs `sorted()`
```python
lines.sort(key=...)          # in place, returns None
lines = sorted(lines, key=...)   # new list
```
`lines = lines.sort(...)` sets `lines` to `None` — then `for line in None` raises
`TypeError: 'NoneType' object is not iterable`. If you see that error, this is why.

## `len(line.split())`
No argument → split on runs of whitespace, drop empties. Matches what a human means by
"number of words", and gives 0 for a blank line.

## If the spec wanted most words first
```python
key=lambda l: (-len(l.split()), l)
```
Negate the numeric part so it reverses while the alphabetical tie-break stays ascending.
`reverse=True` would reverse **both**, putting `zebra apple` before `apple zebra`.
