# Notes — forward references force two passes

This is the *reference* weekly test with a repeat count.

## Why you must read everything first
`#7` appears on line 4 and refers to line 7, which you haven't read yet. A streaming
one-pass solution **cannot** work. So:

```python
lines = sys.stdin.read().splitlines()
for line in lines:
    ...
```
Read it all, then walk it. The 1024-line limit in the spec is there precisely to tell
you this is safe.

**Whenever a spec allows forward references, it is telling you to buffer the input.**

## The line numbering counts EVERY input line
`#7` means the 7th line **of the input**, including the `#` lines themselves. In the
example, input line 7 is `line E`. Do not renumber based on output lines.

`lines[n - 1]` — the spec is 1-based, Python is 0-based. Write the `- 1` deliberately,
and check it against the example before you trust it.

## Matching the two forms with one regex
```python
m = re.fullmatch(r'#(\d+)(?:\*(\d+))?', line)
```
* `(\d+)` — group 1, the line number
* `(?:\*(\d+))?` — an **optional** non-capturing group containing group 2, the count
* `\*` — a literal asterisk; `*` alone is a quantifier
* `fullmatch` — the spec says "no other characters appear on such lines"

When the `*k` part is absent, `m.group(2)` is `None`:
```python
k = int(m.group(2)) if m.group(2) else 1
```
That's the standard way to give an optional group a default.

## Or handle them separately
```python
if re.fullmatch(r'#\d+', line): ...
elif re.fullmatch(r'#\d+\*\d+', line): ...
```
Two patterns, no optional group, no `None` handling. Longer but arguably easier to get
right under pressure. Both are fine — pick the one you can write without hesitating.

## Why `fullmatch` and not `search`
`re.search(r'#(\d+)', line)` would fire on a line like `see #7 for details`, which is
ordinary text and must be printed unchanged. The spec is explicit that the whole line
must be the reference. `fullmatch` enforces that in one call.

## Edge cases
* `#7` → forward reference. The reason for the two passes.
* `#2*3` → three copies of `line B`, each on its own line.
* `#1` → the very first line; check your `- 1`.
* A line that merely *contains* a `#` (`# a comment`, `x #3 y`) is printed unchanged.
* `k = 1` written explicitly as `#2*1` would print one copy — make sure your default
  and your explicit case agree.
