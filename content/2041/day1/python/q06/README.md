# Python Q6 — opening files  (basics)

**Difficulty:** ⭐⭐ · **Target time:** 6 min

---
## LEARN FIRST

```python
with open(filename) as f:
    for line in f:
        print(line, end='')
```
The `with` block closes the file automatically when it ends. Always use it.

Other reads:
```python
with open(filename) as f:
    text  = f.read()          # whole file as one string
    lines = f.readlines()     # list of lines
```
(You can only do one of these per open — reading consumes the file.)

Writing:
```python
with open("out.txt", "w") as f:
    print("hello", file=f)        # or f.write("hello\n")
```
`"w"` truncates, `"a"` appends.

### Handling a missing file
```python
try:
    with open(filename) as f:
        ...
except IOError:
    print(f"{sys.argv[0]}: cannot open {filename}", file=sys.stderr)
```
`try` / `except` is Python's error handling. `IOError` (= `OSError`) covers missing
files and permission problems. COMP2041 questions often ask for exactly this message
shape, so read the spec carefully.

Alternatively check first:
```python
import os
if not os.path.exists(filename):
    ...
```

### Processing many files — the standard shape
```python
for filename in sys.argv[1:]:
    with open(filename) as f:
        for line in f:
            ...
```

---
## THE TASK

Write `q06.py` that takes filenames as arguments and, for each, prints:
```
FILENAME: L lines, W words, C characters
```
(the Python version of `wc`). Characters include the newline at the end of each line.

If a file cannot be opened, print
`q06.py: cannot open FILENAME` to **stderr** and carry on with the next file.

After all files, if there was **more than one** file successfully read, print:
```
total: L lines, W words, C characters
```

Test invocation: `./q06.py a.txt b.txt nosuch.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Per line: `len(line.split())` gives its word count, `len(line)` its character count.
</details>
<details><summary>Hint 2</summary>
Keep running totals in variables outside the file loop, plus a count of files that
opened successfully.
</details>

## CHECK
```sh
./test.sh
```

**Note:** `./test.sh` only compares **stdout**, so the `cannot open` message on stderr
is not part of `expected_output.txt`. Check it separately:
```sh
./q06.py a.txt nosuch.txt 2>&1 1>/dev/null      # shows only stderr
```
