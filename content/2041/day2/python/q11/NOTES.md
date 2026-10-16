# Notes — parsing options by hand, and re flags

This is the *python_grep* weekly test plus option handling. `argparse` exists but is
overkill (and slow to write under time pressure); COMP2041 wants the manual loop.

## The standard option loop
```python
args = sys.argv[1:]
invert = ignore_case = numbered = False

while args and args[0].startswith('-'):
    if args[0] == '-v':
        invert = True
    elif args[0] == '-i':
        ignore_case = True
    elif args[0] == '-n':
        numbered = True
    args.pop(0)

pattern, filename = args
```
* `while args and args[0].startswith('-')` — consume leading options.
  The `args and` guard prevents an IndexError on an empty list. **Order matters in
  `and`**: Python short-circuits, so `args[0]` is only evaluated when `args` is
  non-empty.
* `args.pop(0)` removes the option once handled.
* After the loop, whatever remains is the positional arguments — unpack them directly.

An alternative that avoids mutation:
```python
i = 0
while i < len(sys.argv) - 1 and sys.argv[i + 1].startswith('-'):
    ...
```
Fiddlier. The `pop(0)` version reads better.

## Flags in `re`
```python
flags = re.I if ignore_case else 0
re.search(pattern, line, flags)
```
`re` flags are **integers** that you combine with `|`:
```python
flags = 0
if ignore_case:
    flags |= re.I
```
`0` means "no flags", which is why it's the safe default.

`re.I` and `re.IGNORECASE` are the same constant.

**Careful:** `re.search(pattern, line, flags)` — the third positional parameter *is*
`flags`, so this works. But `re.sub(pat, repl, s, flags)` — there the fourth positional
is `count`, and you must write `flags=flags`. Different functions, different signatures.
Use the keyword form and the question never arises.

## Compile once
```python
regex = re.compile(pattern, flags)
...
    if regex.search(line):
```
Cleaner than passing flags on every call, and it fails fast if the pattern is bad.

## `-v` is a boolean XOR
```python
matched = bool(regex.search(line))
if matched != invert:
    print(...)
```
`matched != invert` is XOR: print when matched and not inverting, or when not matched
and inverting. Shorter and less error-prone than two nested `if`s.

`bool(...)` matters — `regex.search()` returns a match object or `None`, and
`match_object != False` is always True. Convert to a real bool first.

## Line numbers count every line
```python
for i, line in enumerate(f, 1):
```
The counter advances for **every** line read, not just printed ones — that's why
example 4 prints `1:`, `3:`, `5:`. Incrementing only when you print would give
`1:`, `2:`, `3:` — a classic misreading.

## Edge cases
* `-v -i` combined → both flags apply.
* `-n` with `-v` → numbers still refer to file position.
* A regex starting with `-` would be eaten by the option loop. Real `grep` has `--` for
  this; the spec doesn't require it, but notice the limitation.
* `print(line, end='')` — lines from the file keep their `\n`.
* `grep` matches **substrings**, not whole words: the case-sensitive `cat` also matches
  `Dogs and cats`. If you expected only one line there, you were thinking of `grep -w`.
  Check example 1 against your mental model before you start.
