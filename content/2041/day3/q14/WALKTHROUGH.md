# Q14 Walkthrough — Valid Records

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### Method: skeleton first, then fill it in
A validating regex is written **top-down**, never left-to-right in one go.

Step 1 — the skeleton, straight from the numbered spec:
```
^ AWARD \| YEAR \| NAME \| GENDER \| COUNTRY \| BIRTH $
```

Step 2 — one component at a time, testing after each:
```
YEAR     [0-9]{4}
GENDER   (Male|Female)
COUNTRY  [A-Z][A-Za-z]*( [A-Z][A-Za-z]*)*
NAME     ([A-Z][A-Za-z-]*|[A-Z]\.)( ([A-Z][A-Za-z-]*|[A-Z]\.))*
AWARD    [A-Z][A-Za-z]*( [A-Za-z]+)*
```

Step 3 — paste them into the skeleton.

**Never try to hold the whole pattern in your head.** Build it in a shell, adding one
field at a time and watching the match count fall:
```sh
grep -cE '^[A-Z][A-Za-z]*( [A-Za-z]+)*\|' records.psv
grep -cE '^...\|[0-9]{4}\|' records.psv
```
Each new clause tells you exactly which lines it rejects.

### The "list of things separated by X" idiom
This is the pattern that appears in every validating question:
```
ITEM( SEP ITEM)*
```
"one ITEM, then zero or more of (separator + ITEM)". The separator lives **inside** the
repeated group.

```
[A-Z][A-Za-z]*( [A-Z][A-Za-z]*)*        one or more capitalised words
```
Common mistakes:
* `([A-Z][A-Za-z]* )*[A-Z][A-Za-z]*` — works, reads worse.
* `([A-Z][A-Za-z]* )+` — requires a **trailing space** after the last word.
* `[A-Z][A-Za-z ]*` — allows `Ab Cd ef` (lowercase second word) and trailing spaces.
  Too loose. A character class can't express "each word starts with a capital"; you
  need the group-and-repeat form.

### Asymmetric rules: only the first word is constrained
The award rule constrains the **first** word only:
```
[A-Z][A-Za-z]*( [A-Za-z]+)*
   ^first word        ^later words, any case
```
`Nobel Prize for physics` has lowercase `for` and `physics` — perfectly normal, and a
rule demanding every word be capitalised would wrongly reject three of the six valid
records. Read the spec's wording precisely: *"the first word starts with an uppercase
letter"* is not the same as *"each word is capitalised"*, and the country rule below
really is the stricter one.

### Alternation inside the item
The name field allows two kinds of word — a capitalised word **or** an initial:
```
([A-Z][A-Za-z-]*|[A-Z]\.)
```
Then the whole alternation becomes the ITEM in the list idiom. Brackets around the
alternation are essential: without them, `A|B C` groups as `A` or `(B C)`.

### Exact counts
```
[0-9]{4}
```
The spec says **exactly 4 digits**, so write `{4}`, not `+`. `[0-9]+` accepts `196`
and `19400`, which are two of the six planted bad lines.

**When a spec gives a number, put the number in the regex.** `+` is for "one or more".

### Every field needs a terminator
`[0-9]{4}` followed by `\|` — otherwise `19400` matches its first four digits and the
line passes. The last field ends at `$`. This is the same lesson as Q4 and it is worth
repeating because it is the most common lost mark in the course.

### `\|` under `-E`
An unescaped `|` means alternation. There are five literal pipes in this pattern; miss
one and the whole regex becomes a giant alternation that matches nearly everything.

---
## PART 2 — THE APPROACH

Label each bad line in `records.psv` **before** you write anything:

| line | breaks |
|---|---|
| `nobel prize for peace\|...` | the award's **first** word must start uppercase |
| `ACM Turing Award\|196\|...` | year is 3 digits, not 4 |
| `...\|female\|...`           | gender is exactly `Male` or `Female` |
| `...\|19400`                 | birth year is 5 digits |
| `...\|Female\|\|1958`        | country must not be empty |
| `Fields Medal\|2022\|hugo Duminil-Copin\|...` | name word starts lowercase |

Notice how many are caught by *the character after the field* rather than by the field
pattern itself. That is why anchors and literal delimiters do most of the work.

---
## PART 3 — THE SOLUTION

```sh
grep -E '^[A-Z][A-Za-z]*( [A-Za-z]+)*\|[0-9]{4}\|([A-Z][A-Za-z-]*|[A-Z]\.)( ([A-Z][A-Za-z-]*|[A-Z]\.))*\|(Male|Female)\|[A-Z][A-Za-z]*( [A-Z][A-Za-z]*)*\|[0-9]{4}$'
```

Field by field:

| field | pattern |
|---|---|
| award   | `[A-Z][A-Za-z]*( [A-Za-z]+)*` — first word capitalised, later words any case (so `Nobel Prize for physics` passes and `nobel prize for peace` does not) |
| year    | `[0-9]{4}` |
| name    | `([A-Z][A-Za-z-]*\|[A-Z]\.)( ...)*` — capitalised words (hyphens allowed) or initials |
| gender  | `(Male\|Female)` |
| country | `[A-Z][A-Za-z]*( [A-Z][A-Za-z]*)*` — one or more capitalised words, at least one |
| birth   | `[0-9]{4}` anchored by `$` |

`Duminil-Copin` needs the `-` in `[A-Za-z-]`. Note the hyphen is **last** inside the
class — `[A-Za-z-]`. Put it in the middle (`[A-Z-a-z]`) and it becomes a range operator
and the class means something else entirely. **A literal `-` goes first or last.**

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`\|` five times.** If your grep returns everything, you missed one.
* **`{4}` not `+`** — `196` and `19400` exist precisely to catch this.
* **The empty country** (`Female||1958`) is rejected because the country pattern
  requires at least one word. `[A-Za-z ]*` would have accepted it.
* **`Male|Female` must be bracketed.** Unbracketed, `\|Male|Female\|` parses as
  "`\|Male`" or "`Female\|`" and matches far too much.
* **Hyphen placement** in `[A-Za-z-]`.
* Anchors at both ends. Drop `$` and the 5-digit birth year passes.
* Build it incrementally with `grep -c`. Watching the count drop 12 → 11 → 10 … tells
  you which clause does what, and catches a clause that rejects everything.
