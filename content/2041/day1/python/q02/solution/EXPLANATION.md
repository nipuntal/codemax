# Python Q2 explanation

```python
if len(sys.argv) < 2:
```
`sys.argv` always contains at least the program name, so "no arguments" means
`len(sys.argv) == 1`. Writing `< 2` says "fewer than one real argument".

```python
    print(f"Usage: {sys.argv[0]} <int>...", file=sys.stderr)
    sys.exit(1)
```
The direct translation of
```sh
echo "Usage: $0 <int>..." 1>&2
exit 1
```

```python
nums = [int(a) for a in sys.argv[1:]]
```
A **list comprehension**: read it as "int(a), for each a in the argument list".
It is the same as:
```python
nums = []
for a in sys.argv[1:]:
    nums.append(int(a))
```
Comprehensions are everywhere in COMP2041 Python answers — get comfortable reading
them. The shape is always `[EXPRESSION for VAR in ITERABLE]`, optionally with
`if CONDITION` on the end:
```python
evens = [int(a) for a in sys.argv[1:] if int(a) % 2 == 0]
```

## Shorter still
```python
nums = list(map(int, sys.argv[1:]))
```
`map(f, xs)` applies `f` to each element. Equivalent; use whichever you find clearer.

## Common mistakes
* `sys.argv[0:]` — includes the program name, so `int("./q02.py")` crashes.
* Forgetting `int()` — `max(["4","17","3"])` is `"4"` because strings compare
  alphabetically. Silent wrong answer, no error. **Convert early.**
