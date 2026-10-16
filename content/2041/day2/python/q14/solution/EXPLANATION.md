# Q14 explanation

```python
lines = sys.stdin.read().splitlines()

for line in lines:
    m = re.fullmatch(r'#(\d+)(?:\*(\d+))?', line)
    if m:
        n = int(m.group(1))
        k = int(m.group(2)) if m.group(2) else 1
        for _ in range(k):
            print(lines[n - 1])
    else:
        print(line)
```

## Two passes, because of `#7`
Line 4 is `#7`, referring to line 7 — which hasn't been read yet when you reach line 4.
No streaming solution exists. `sys.stdin.read().splitlines()` buffers everything, and
the spec's 1024-line limit is your permission to do that.

Read specs for this signal: **"all n values will be valid input line numbers" with no
"backward only" restriction means forward references are in play.**

## The regex
```
#(\d+)(?:\*(\d+))?
```
| piece | meaning |
|---|---|
| `#`            | literal |
| `(\d+)`        | group 1 — the line number |
| `(?:` … `)?`   | an optional **non-capturing** wrapper |
| `\*`           | a literal asterisk (bare `*` is a quantifier) |
| `(\d+)`        | group 2 — the repeat count |

`re.fullmatch` requires the pattern to consume the **entire** line, which enforces the
spec's "no other characters appear on such lines". With `re.search`, a normal sentence
like `see #7 for details` would be treated as a reference and mangled.

## The optional group gives `None`
```python
k = int(m.group(2)) if m.group(2) else 1
```
When `#n` has no `*k`, group 2 didn't participate and `m.group(2)` is `None`.
`int(None)` raises, so you test first. The `X if cond else Y` conditional expression is
the compact way to supply a default.

## `lines[n - 1]`
The spec numbers from 1; Python indexes from 0. `#1` must give the first line, so the
`- 1` is required. Check it against the example (`#1` → `line A`) rather than trusting
the arithmetic — off-by-one here is invisible until it isn't.

## `for _ in range(k)`
`_` is the conventional name for a loop variable you don't use. `range(1)` runs once,
so the no-`*k` case needs no separate branch.

## `splitlines()` and plain `print`
`splitlines()` strips the newlines, so `print` adds them back — one consistent
convention. Mixing `readlines()` (keeps `\n`) with plain `print` is what produces
double-spaced output.
