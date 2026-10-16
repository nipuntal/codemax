# Notes — argv, slicing, and joining

## The three facts
```python
sys.argv[0]      # the program name
sys.argv[1:]     # the real arguments, as a list
' '.join(xs)     # a list of strings -> one string
```

## Reversing
```python
xs[::-1]              # a new reversed list -- slice with step -1
list(reversed(xs))    # same
xs.reverse()          # IN PLACE, returns None
```
`xs = xs.reverse()` sets `xs` to `None`. That is the single most common Python slip in
this course. **Methods that mutate return `None`.**

`[::-1]` also reverses strings: `"abc"[::-1]` → `"cba"`.

## Printing one line
```python
print(' '.join(sys.argv[1:]))
```
`print` supplies the newline. With no arguments, `' '.join([])` is `''` and you get an
empty line — exactly what the spec asks for, with no special case needed.

Compare the loop version:
```python
for a in reversed(sys.argv[1:]):
    print(a, end=' ')
print()
```
Correct, but leaves a trailing space. The spec here doesn't allow one — read carefully,
because some questions (the shell `three_vowel_echo`) explicitly do.

## `join` needs strings
`' '.join([1, 2])` is a TypeError. `sys.argv` is always strings so it's fine here, but
the moment you convert to numbers you need `' '.join(str(x) for x in xs)`.

## Alternative: `print(*xs)`
```python
print(*sys.argv[:0:-1])
```
`*` unpacks a list into separate arguments, and `print` separates them with a space.
Neat — but `[:0:-1]` (reverse, stopping before index 0) is the kind of clever slice
that's easy to get wrong under pressure. `' '.join(sys.argv[1:][::-1])` says what it
means.
