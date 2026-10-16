# Q3 Walkthrough — Four grep Commands (warm-up)

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### The one rule that answers most grep questions on delimited data
**Pin the field down with its delimiters.**

A pipe-separated line is
```
field1|field2|field3|field4|field5|field6
```
so *"field 1 is X"* is `^X\|`, *"the last field is X"* is `\|X$`, and *"some middle
field is exactly X"* is `\|X\|`. The delimiters are what stop your pattern matching a
substring in the wrong column.

```sh
grep -E '^Fields Medal\|'    # field 1 is exactly "Fields Medal"
grep -E '\|Japan\|'          # SOME field is exactly "Japan"
grep -E '\|19[0-9][0-9]$'    # the LAST field is a 19xx year
```

### `-E` and the pipe character — the tangle
Under `grep -E`, an **unescaped `|` means alternation** (`a|b` = "a or b").
To match a literal pipe you must write `\|`.

Without `-E` it is the other way round: `|` is literal and `\|` means alternation.

Two habits that make this a non-issue:
1. **Always use `-E`.** Then `+ ? ( ) { }` all work without backslashes.
2. **Always single-quote the pattern.** The shell would otherwise eat `|`, `$`, `*`.

### Anchors
| pattern | meaning |
|---|---|
| `^X`  | line starts with X |
| `X$`  | line ends with X |
| `^X$` | the line is exactly X |

Nearly every wrong grep answer is a missing anchor.

### `[^|]*` — reaching a specific field
To say "field 2 is 196x" you must first cross field 1, which may contain anything
except a pipe:
```
^[^|]*\|196[0-9]\|
```
`[^|]*` is *"any run of non-pipe characters"* — it cannot leak into the next field
because it can't match the delimiter. **"Anything except the delimiter" is how you
count fields in a regex.** `.*` would be greedy and slide past as many pipes as it
liked.

### Ranges of numbers
There is no `[1960-1969]`. A regex range is over **characters**, not numbers.
"1960 to 1969" is "196 followed by any digit": `196[0-9]`.
Wider ranges need alternation — see Q4.

### Useful options
| flag | does |
|---|---|
| `-E` | extended regex (use always) |
| `-i` | case insensitive |
| `-v` | invert: non-matching lines |
| `-c` | count instead of printing |
| `-w` | match whole words |
| `-x` | match whole lines |

---
## PART 2 — THE APPROACH

Take each question and ask: **which field, and is it the whole field or part of it?**

1. *Fields Medal* — field 1, whole field. Field 1 starts at `^`, ends at the first
   `|` → `^Fields Medal\|`.
2. *1960s* — field 2, whole field. Cross field 1 with `[^|]*`, then `196[0-9]`, then
   the closing delimiter.
3. *Japan* — the country field, whole field. You could count across to field 5, but
   `\|Japan\|` is enough: no other field can contain exactly `Japan` between two
   pipes. Choose the simplest pattern that can't be wrong.
4. *Middle initial* — inside field 3 (the name). The shape is
   `word SPACE capital DOT SPACE word`, and the whole thing sits between the delimiters
   of field 3.

Test each one before you write it down:
```sh
grep -cE '^Fields Medal\|' awards.psv
```
`-c` gives you a count in one line — much faster to sanity-check than scrolling output.

---
## PART 3 — THE SOLUTION

```sh
grep -E '^Fields Medal\|' awards.psv
grep -E '^[^|]*\|196[0-9]\|' awards.psv
grep -E '\|Japan\|' awards.psv
grep -E '\|[A-Za-z]+ [A-Z]\. [A-Za-z]+\|' awards.psv
```

**1.** `^` then the literal text then `\|`. Anchoring at both ends of the field means a
hypothetical `Fields Medallion` award would not match.

**2.** `^[^|]*\|` crosses field 1 exactly. Then `196[0-9]` and `\|` pin field 2.
Note the trailing `\|` — without it, a five-digit year `19600` would match its first
four characters.

**3.** `\|Japan\|` — a field that is exactly `Japan`. A winner *named* Japan would also
match, which is why a stricter answer counts across to field 5; here it makes no
difference, and the shorter pattern is easier to get right under time pressure.

**4.** `\|` then `[A-Za-z]+` (given name), a space, `[A-Z]\.` (the initial — note `\.`
for a **literal** dot), a space, `[A-Za-z]+` (surname), then `\|`. The two delimiters
confine the whole match to field 3.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`\.` vs `.`** — an unescaped dot matches *any* character, so `[A-Z].` would match
  `Ab`. Escaping the dot is the whole point of question 4.
* **`\|` everywhere the pipe is literal.** Miss one under `-E` and the pattern becomes
  a giant alternation that matches almost every line. If a grep suddenly returns
  everything, look for an unescaped pipe.
* **Single quotes, always.** `grep -E "^Fields Medal\|"` survives here, but the moment
  a pattern contains `$` or backticks the shell mangles it.
* `grep -c PATTERN file` while developing, then drop the `-c`. Checking a count is far
  faster than eyeballing lines.
* Field 3 in this data sometimes has no middle initial (`Charles King`) and sometimes
  does (`Ahmed H. Larsen`). Question 4 must find exactly the second kind — check both
  a positive and a negative example before moving on.
