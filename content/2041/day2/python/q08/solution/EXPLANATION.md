# Q8 explanation

```python
n = int(sys.argv[1])
seen = set()
lines = 0

for line in sys.stdin:
    lines += 1
    for word in line.lower().split():
        seen.add(word)
    if len(seen) >= n:
        print(f"{n} distinct words seen after {lines} lines read.")
        break
else:
    print(f"End of input reached after {lines} lines read - {n} different words not seen.")
```

## `for ... else`
The `else` belongs to the **`for`**, not to an `if`. It runs only when the loop ends
naturally — i.e. when stdin was exhausted without a `break`. That is precisely the
"end of input reached first" case.

Mentally rename it **`for ... then-if-no-break`** and it stops being confusing.
It removes the `found = False` flag that people otherwise forget to reset.

## `>= n`, not `== n`
A single line can introduce several new words, so `len(seen)` can jump 2 → 4 and skip
over `n = 3` entirely. With `==` the program would silently never report.

The original weekly test counted *lines*, which can only increment by one, so `==`
worked there. Changing the unit from lines to words changes the correct operator —
that's the kind of detail a variant question is testing.

## The check is per line
`lines += 1` at the top, the word loop, then the check. So the count reported includes
the line that completed the set. In example 2, `HELLO there friend` is line 3
and takes the distinct count from 2 to 4 → "after 3 lines read." 

## The set
```python
seen.add(word)
```
Adding a duplicate is a no-op, so no `if word not in seen` is needed. `len(seen)` is
the distinct count. Sets are the right structure whenever the question says
"different" or "distinct".

## `line.lower().split()`
Case fold, then split on runs of whitespace. `Hello World` and `hello world` therefore
contribute the same two words, and the second line adds nothing new.

## Copy the message format exactly
```
1 distinct words seen after 1 lines read.
End of input reached after 2 lines read - 10 different words not seen.
```
"1 distinct words" and "1 lines" are grammatically wrong and that is what the spec
says. The `-` in the second message is a plain hyphen surrounded by spaces. The full
stop is required. Autotests diff character by character — **transcribe, don't
paraphrase.**
