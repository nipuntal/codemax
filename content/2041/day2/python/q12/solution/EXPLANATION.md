# Q12 explanation

```python
factor = int(sys.argv[1])
NUMBER = r'[0-9]+\.?[0-9]*'

for line in sys.stdin:
    print(re.sub(NUMBER, lambda m: str(round(float(m.group()) * factor)), line), end='')
```

## The function replacement
```python
re.sub(pattern, function, string)
```
`re.sub` calls `function(match)` for every match and substitutes whatever string it
returns. That's how you compute a replacement from the matched text — something `sed`
fundamentally cannot do.

Inside: `m.group()` is the matched text (`"15.50"`), `float(...)` converts,
`* factor` scales, `round(...)` gives an int, `str(...)` makes it a replacement string.

The `lambda` closes over `factor`, so it sees the command-line value without being
passed it.

## The pattern accepts `12345.`
```
[0-9]+\.?[0-9]*
```
* `[0-9]+` — at least one digit
* `\.?`    — an optional dot
* `[0-9]*` — zero or more digits after it

The `*` (not `+`) on the last part is what admits `12345.`, which the spec lists as a
valid number. `[0-9]+(\.[0-9]+)?` would match only `12345` and leave the dot behind,
producing `24690.` instead of `24690`.

Read the spec's list of examples as a **test suite for your regex**. Every one of them
is there because it breaks a plausible wrong pattern.

## `round()` is banker's rounding
```python
round(0.5) == 0     round(1.5) == 2     round(2.5) == 2     round(3.5) == 4
```
Ties go to the nearest **even** integer. `15.50 * 1 = 15.5` → `16`, because 16 is even —
which happens to agree with school rounding here, but `2.5` would not.

If a question's sample output shows `.5` always rounding up, `round()` is wrong and you
want `math.floor(x + 0.5)`. Check the samples; don't assume either behaviour.

## `round()` vs `int()`
`round(3.9)` is `4`; `int(3.9)` is `3` (truncation toward zero). They are different
functions and only one of them is "nearest". Also, `round(7.0)` returns the **int** `7`,
so `str()` gives `"7"` and not `"7.0"` — which is the format the spec wants.

## `print(..., end='')`
`line` still carries its `\n`, and `re.sub` doesn't touch it. Without `end=''` you'd get
a blank line between every output line.

## Why line-by-line is fine
The pattern never spans a newline, so processing per line and processing the whole input
give identical results. Streaming is the better habit.
