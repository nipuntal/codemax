# Q17 explanation

## The separator flag
```python
    printed_any = False
    for name in files:
        try:
            f = open(name)
        except IOError:
            print(f"q17.py: cannot open {name}", file=sys.stderr)
            continue
        if printed_any:
            print()
        printed_any = True
```
Three details, all load-bearing:

1. **`if printed_any: print()`** puts the blank line *before* each file except the
   first — which is what "between files" means. Printing it after each file would leave
   a trailing blank.
2. **`printed_any = True` comes after the `try`.** A file that fails to open never sets
   it, so it can't cause a stray blank line before the next file. Example 3
   (`a.txt nosuch.txt b.txt`) is in the spec purely to catch this.
3. **`continue` in the `except`** skips the header and the reading for that file.

## `if len(files) > 1` for the header
Based on the number of files **given**, not opened. `head a.txt nosuch.txt b.txt` prints
headers for a.txt and b.txt, matching real `head`.

## Reading lazily
```python
    for i, line in enumerate(f):
        if i >= n:
            break
```
Stops after n lines and never reads the rest. `f.readlines()[:n]` produces the same
output but loads the whole file — on a 10GB log that's the difference between instant
and unusable. Same result, different program.

`itertools.islice(f, n)` is the idiomatic one-liner if you know it.

## `with f:` after an already-open file
`open()` happens in the `try` so the failure can be caught, and `with f:` then takes
over closing it. `with open(name) as f:` inside the `try` also works — but then the
whole body sits inside the `try`, and an unrelated error deep in your code would be
caught and misreported as "cannot open". **Keep `try` blocks as small as the thing you
are actually guarding.**

## `-n` consumes two arguments
```python
if len(args) >= 2 and args[0] == '-n':
    n = int(args[1])
    args = args[2:]
```
The `len(args) >= 2` guard prevents an IndexError on a bare `-n`. Reslicing `args`
leaves only the filenames.

## `print(..., file=sys.stderr)`
The error goes to stderr so it doesn't pollute the output stream — that's the point of
stderr existing, and `./q17.py a.txt nosuch.txt > out` must still produce clean output.
This is the Python spelling of shell's `1>&2`.
