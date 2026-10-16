# Python Q8 explanation

```python
if len(sys.argv) != 2 or not sys.argv[1].isdigit() or int(sys.argv[1]) < 1:
```
Three checks joined by `or` — any one failing triggers the usage message.
**The order matters.** `or` short-circuits: if `len(sys.argv) != 2` is True, Python
never evaluates `sys.argv[1]`, so there's no IndexError. Put the cheapest, most
protective check first.

`.isdigit()` is True only if every character is 0-9, so it rejects `""`, `-5`, `3.5`
and `abc` — a neat one-call validator for non-negative integers.

```python
for i in range(1, n + 1):
```
`range(1, n + 1)` gives 1..n **inclusive**. Forgetting the `+ 1` is the most common
off-by-one in Python.

```python
    if i % 15 == 0:
```
15 is 3×5, so "divisible by both" is "divisible by 15". Testing it **first** is
essential — an `elif` chain stops at the first true branch, so if `% 3` came first,
15 would print `Fizz` and never reach the FizzBuzz case.

The alternative, if you don't spot the 15 trick:
```python
    if i % 3 == 0 and i % 5 == 0:
```
Same thing, equally correct.

## Building the string instead
```python
    out = ""
    if i % 3 == 0: out += "Fizz"
    if i % 5 == 0: out += "Buzz"
    print(out or i)
```
`out or i` uses falsiness: an empty string is falsy, so it falls through to `i`.
Elegant — but only write it if you're sure. **Under exam pressure, the obvious
elif chain is worth exactly the same marks.**
