# Notes — `re.sub` with a function, and banker's rounding

This is the *text_round* weekly test with a multiplier.

## The number regex
```
[0-9]+\.?[0-9]*
```
digits, optional dot, optional further digits. That covers `0`, `100`, `3.14159`,
`1000.0` and `12345.` — the spec lists them, so check each against your pattern.

`\d+\.?\d*` is the same thing.

**Don't** write `[0-9]+(\.[0-9]+)?` — it rejects `12345.` (a trailing dot with no
digits), which the spec explicitly includes. And if you do use a group, make it
non-capturing `(?: )`, or `re.sub`'s behaviour with backreferences gets confusing.

## Replacing with a computed value
`sed` cannot do arithmetic inside a substitution. Python can, because `re.sub` accepts
a **function** as the replacement:
```python
re.sub(NUMBER, lambda m: str(round(float(m.group()) * factor)), line)
```
The function is called once per match with the match object, and must return a string.
`m.group()` is the matched text.

**This is the single technique that makes Python questions like this trivial and shell
questions like this impossible.** Recognise it when a question says "replace each X with
something computed from X".

## Python's `round()` does banker's rounding
```python
round(0.5)    # 0   -- not 1
round(1.5)    # 2
round(2.5)    # 2   -- not 3
round(3.5)    # 4
```
Ties go to the **even** number. This is deliberate (it avoids systematic upward bias)
and it is not what most people expect.

Does it matter here? Work out `15.50 * 1 = 15.5` → `round(15.5)` = **16** (16 is even).
And `2.5` would go to 2. Whether the test data hits a tie is something you should
**check**, not assume:
```sh
python3 -c "print(round(15.5), round(2.5), round(0.5))"
```

If a spec demands school rounding (always up on .5), banker's rounding is wrong and you
need:
```python
import math
math.floor(x + 0.5)
```
Read the spec. "Nearest whole number" is ambiguous about ties; the sample output is the
tie-breaker — match it.

## `round()` returns an int
`round(7.0)` is `7`, not `7.0`, so `str(round(...))` gives `7`. Good — that's the
required format. `int(x)` would **truncate** (`int(3.9)` is `3`), which is a different
operation entirely.

## Line by line or whole input?
Either. `re.sub` on each line keeps the `\n` intact if you use `end=''`:
```python
for line in sys.stdin:
    print(re.sub(...), end='')
```
Or slurp with `sys.stdin.read()` and do one `re.sub` — the pattern never spans lines, so
both give the same answer.

## Edge cases
* `12345.` → `float("12345.")` is `12345.0` → ×2 → `24690`. The trailing dot disappears
  from the output, as the sample shows.
* `0.999` ×1 → `round(0.999)` = `1`. ×2 → `1.998` → `2`.
* `0` → stays `0` for any factor.
* `2001` ×2 = `4002` — plain integers are numbers too.
* `$15.50` — the `$` is not part of the number; the regex starts at the `1`.
* `3.3kg` — the `kg` is left alone.
