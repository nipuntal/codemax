# Notes — separators between items, not after them

Straight from the week-7 tutorial. `head` looks trivial and the separator logic isn't.

## Printing a separator BETWEEN items
The wrong instinct:
```python
for name in files:
    print_header(name)
    print_lines(name)
    print()               # blank AFTER each -- leaves a trailing blank line
```
The spec says *between*. Two clean ways:

```python
first = True
for name in files:
    if not first:
        print()           # blank BEFORE every file except the first
    first = False
    ...
```
or track an index:
```python
for i, name in enumerate(files):
    if i > 0:
        print()
```

**"Separator between N items" always means "print it before item i for i > 0".**
Same idea as `' '.join()` — n items, n−1 separators.

## The failed-file complication
A file that can't be opened prints nothing and must not leave a stray blank line
behind. So the "have I printed anything yet" flag must be updated only on **success**:

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
    ...
```
Note `printed_any = True` comes *after* the `try`. If you set it before, a failing file
would still trigger the blank line for the next one. The third example exists precisely
to test this.

## Reading only the first n lines
```python
for i, line in enumerate(f):
    if i >= n:
        break
    print(line, end='')
```
or the slice-free `itertools.islice(f, n)`. Don't use `f.readlines()[:n]` — it loads the
whole file to print 10 lines. Works, but it's the wrong habit and a question about
large files would penalise it.

## `-n` parsing
```python
if args[0] == '-n':
    n = int(args[1])
    args = args[2:]
```
An option **with a value** consumes two arguments. Real `head` also accepts `-5` and
`-n5`; the spec here only requires `-n NUM`, so don't build what wasn't asked for.

## Header only when >1 file
```python
if len(files) > 1:
    print(f"==> {name} <==")
```
Count the files given, not the files successfully opened — real `head` behaves this way
and the spec's examples match.

## Edge cases
* Zero files → stdin, no header.
* One file → no header, no blank lines.
* A missing file in the middle → error on stderr, no header, no blank line, and the
  *next* file's blank line still appears correctly.
* A file shorter than n → print what there is, no padding.
* `print(line, end='')` — lines keep their `\n`.
