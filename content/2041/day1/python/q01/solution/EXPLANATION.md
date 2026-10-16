# Python Q1 explanation

```python
for i, line in enumerate(sys.stdin, 1):
    print(f"{i}: {line.strip()}")
```

* `enumerate(iterable, start)` yields `(index, item)` pairs. The `1` makes numbering
  start at 1 instead of 0 — this is the whole reason to use it.
* `line.strip()` removes the trailing `\n` (and any surrounding spaces).
* The f-string `f"{i}: {...}"` builds the output. Anything inside `{ }` is evaluated.

## Without enumerate
```python
n = 0
for line in sys.stdin:
    n += 1
    print(f"{n}: {line.strip()}", end='\n')
```
Same result. `enumerate` is shorter and less bug-prone — but if you forget it exists,
a counter always works. Never let a forgotten builtin cost you the question.

## The three printing styles (all valid)
```python
print(f"{i}: {line.strip()}")           # f-string   <- prefer this
print(str(i) + ": " + line.strip())     # concatenation
print(i, line.strip(), sep=': ')        # sep argument
```

## Common mistakes
* `print(f"{i}: {line}")` → an extra blank line after each. You forgot the strip.
* `enumerate(sys.stdin)` without the `1` → numbering starts at 0.
