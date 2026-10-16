# Q1 explanation

```python
print(' '.join(sys.argv[1:][::-1]))
```

Read it right to left:
* `sys.argv[1:]` — drop the program name
* `[::-1]` — reverse it (a slice from start to end with step −1)
* `' '.join(...)` — one string, space separated
* `print` — adds the newline

## Why no special case for zero arguments
`sys.argv[1:]` is `[]`, `[][::-1]` is `[]`, `' '.join([])` is `''`, and `print('')`
emits a bare newline. The spec asks for an empty line — you get it for free.

Look for this whenever a spec has an "if empty" clause: often the natural code already
does the right thing, and adding an `if` is wasted effort *and* a chance to introduce a
bug.

## No trailing space
```python
print(' '.join(xs))          # "c b a"      <- separator BETWEEN items
for x in xs: print(x, end=' ')  # "c b a "  <- separator AFTER each item
```
`join` puts the separator between elements, so there are n−1 of them. That's why it's
the right tool whenever the spec says "separated by spaces" with no trailing one.

## `[::-1]` vs `.reverse()`
```python
xs[::-1]        # returns a new reversed list
xs.reverse()    # mutates xs, returns None
```
`print(' '.join(xs.reverse()))` fails with "can only join an iterable" because
`.reverse()` gave back `None`. Any method that changes an object in place returns
`None` — `.sort()`, `.append()`, `.reverse()`, `.extend()`.
