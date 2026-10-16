# Q15 Walkthrough — Squeeze and Strip

> **Read this after you have attempted the question.**

This is `tr` reimplemented in Python, plus option parsing. Both halves are examinable
on their own.

---
## PART 1 — TEACH

### Option parsing when one option takes a value
Flags with no value can be parsed with `'-s' in sys.argv`. As soon as **one option takes
an argument**, you need an index-based loop so you can consume the *next* item:

```python
i = 0
while i < len(args):
    if args[i] == '-d':
        i += 1              # step onto the value
        delete = args[i]
    elif args[i] == '-s':
        squeeze = True
    i += 1                  # step past whatever we just handled
```

The two `i += 1` lines are doing different jobs: the inner one consumes the **value**,
the outer one consumes the **flag**. Together they advance by 2 for `-d CHARS` and by 1
for a bare flag.

A `for` loop cannot do this — you can't skip ahead. **An option that takes a value
means a `while` loop with an explicit index.**

### Deleting characters — `tr -d`
```python
''.join(c for c in line if c not in delete)
```
* iterate the characters
* keep those **not** in the delete set
* `''.join(...)` glues them back with nothing between

`c not in delete` works because `in` on a string tests substring membership, and for a
single character that's exactly set membership. For big sets, `set(delete)` is faster;
for exam-sized input it makes no difference.

This is the Python equivalent of `tr -d 'aeiou'`. The companion `''.join(c for c in s if
COND)` shape also does `tr -cd` (keep only these) by flipping the condition.

### Squeezing whitespace — `tr -s`
```python
re.sub(r'\s+', ' ', line)
```
`\s` is any whitespace (space, tab, newline, …); `+` makes it a run; each run becomes a
single space. This handles the tab in `messy.txt` for free — `line.replace('  ', ' ')`
would not, and would also need repeating until stable.

**Note this is not `' '.join(line.split())`.** That variant *also strips* leading and
trailing whitespace, which the spec here does **not** ask for — look at the expected
output: `   spaced   out   ` becomes `" spaced out "` **with** the leading and trailing
single spaces. Choosing the wrong one silently changes three lines of output.

| you want | use |
|---|---|
| collapse runs, keep the edges | `re.sub(r'\s+', ' ', s)` |
| collapse runs **and** strip the edges | `' '.join(s.split())` |

### Order of operations
The spec fixes the order: delete, squeeze, upper. It matters — deleting `aeiou` before
uppercasing removes lowercase vowels only; doing it after would remove nothing (they'd
all be `AEIOU`). Check the third example: `Hello` → `Hll` → `HLL`.

**When a spec numbers its transformations, apply them in that order and don't
"optimise".**

### `.rstrip('\n')` then `print`
Strip the newline, transform, print (which adds one back). The alternative — keep the
`\n` and use `print(..., end='')` — breaks here, because `\s+` would eat the trailing
newline and glue lines together.

---
## PART 2 — THE APPROACH

1. Parse options with an index `while` loop; `-d` consumes the next argument.
2. Loop over stdin.
3. `rstrip('\n')`, then apply the three transformations **in spec order**, each guarded
   by its flag.
4. `print(line)`.

Test each option alone before combining them.

---
## PART 3 — THE SOLUTION

```python
i = 0
while i < len(args):
    if args[i] == '-d':
        i += 1
        delete = args[i]
    elif args[i] == '-s':
        squeeze = True
    elif args[i] == '-u':
        upper = True
    i += 1

for line in sys.stdin:
    line = line.rstrip('\n')
    if delete:
        line = ''.join(c for c in line if c not in delete)
    if squeeze:
        line = re.sub(r'\s+', ' ', line)
    if upper:
        line = line.upper()
    print(line)
```

`if delete:` — an empty string is falsy, so the deletion step is skipped when `-d`
wasn't given. Guarding on the *value* rather than a separate boolean is idiomatic.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`re.sub(r'\s+', ' ', line)` not `' '.join(line.split())`.** The expected output
  keeps the leading and trailing spaces on `   spaced   out   `. Read the sample
  character by character.
* **The blank line stays blank.** `\s+` on `''` matches nothing, so it passes through.
* **Order: delete → squeeze → upper.** Uppercasing first would break `-d 'aeiou'`.
* **`-d` consumes the next argument.** `-d '!,' -s` must set `delete = '!,'` and
  `squeeze = True`, not treat `-s` as the value.
* The tab in the input is whitespace — `\s` covers it, a literal `' '` would not.
* `r'\s+'` — a **raw string**. Always prefix regexes with `r`; in a normal string
  Python may interpret the backslash itself.
