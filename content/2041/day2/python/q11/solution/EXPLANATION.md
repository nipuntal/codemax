# Q11 explanation

## The option loop
```python
while args and args[0].startswith('-'):
    ...
    args.pop(0)

pattern, filename = args
```
Consume leading `-x` arguments, then whatever's left is positional. Unpacking straight
into `pattern, filename` is concise and raises loudly if the argument count is wrong.

`args and args[0]...` — Python's `and` short-circuits, so `args[0]` is only evaluated
once `args` is known non-empty. Swap the order and you get an `IndexError` on an empty
list. This ordering habit is worth having everywhere.

## `re.I if ignore_case else 0`
`re` flags are integers; `0` means none. For several flags you'd OR them:
```python
flags = 0
if ignore_case:
    flags |= re.I
if multiline:
    flags |= re.M
```

Compiling once (`re.compile`) rather than passing flags to every `re.search` call keeps
the loop clean and catches a bad pattern immediately.

## `matched != invert` — XOR
| matched | invert | print? |
|---|---|---|
| True  | False | ✓ |
| False | False | ✗ |
| True  | True  | ✗ |
| False | True  | ✓ |

That's exactly `!=` on two booleans. The four-case `if`/`else` version is correct too
but longer and easier to get backwards.

**`bool(...)` is not optional.** `regex.search(line)` returns a match object or `None`.
`<match object> != False` is always True, so without the `bool()` every line would print
in both modes. Convert first.

## `enumerate(f, 1)` counts every line
The line number comes from the file position, not from how many lines you've printed.
Example 4 prints `1:`, `3:`, `5:` — the gaps are the point. A counter incremented inside
the `if` would produce `1:`, `2:`, `3:` and quietly fail.

## `print(line, end='')`
Lines from a file iterator keep their trailing `\n`. Without `end=''` the output is
double-spaced — and with `-n`, `f"{i}:{line}"` already contains the newline at the end,
so the same rule applies.

## Reading the file lazily
`for line in f` streams, rather than `f.readlines()` loading everything. Not required
here, but it's the habit that makes your tools work on large files.
