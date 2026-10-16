# Python Q6 explanation

```python
total_lines = total_words = total_chars = 0
```
Chained assignment — all three become 0. Fine for immutable values like numbers.
(Don't do it with lists: `a = b = []` makes them the **same** list.)

```python
    try:
        with open(filename) as f:
            ...
    except IOError:
        print(..., file=sys.stderr)
        continue
```
* The counting happens **inside** the `try`, so a read error is caught too.
* `continue` skips the rest of this loop iteration — so the per-file `print` and the
  total accumulation are skipped for a failed file. That's why they sit *after* the
  `try` block, not inside it.

```python
                words += len(line.split())
                chars += len(line)
```
* `line.split()` handles runs of spaces, so this matches real `wc -w`.
* `len(line)` includes the trailing `\n`, matching `wc -c`.

## `n_ok` and the total line
The spec says "more than one file **successfully read**". `nosuch.txt` doesn't count,
so we track `n_ok` separately from `len(sys.argv) - 1`. Read specs this literally —
markers test the edge case.

## `IOError` vs `FileNotFoundError`
`IOError` is an alias for `OSError` and catches missing files, permission errors, and
directories. `FileNotFoundError` is narrower. `IOError` is the safe exam choice.

## Reading stdin when there are no file arguments
Real `wc` does this. The idiom:
```python
files = sys.argv[1:] or ['-']
...
f = sys.stdin if filename == '-' else open(filename)
```
Not required here, but worth recognising.
