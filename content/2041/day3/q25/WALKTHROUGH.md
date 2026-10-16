# Q25 Walkthrough — Years An Award Was Not Given (exam Q5, 8 marks)

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### Reframe: this is set subtraction with a computed range
> the answer is (every year from first to last) **minus** (the years it was given)

Exactly Q10's *missing integer*, with two differences:
* the range is derived from the data rather than given
* there may be **many** gaps, not one

Q10 used `seq` + `comm` and temp files. **This question forbids temp files**, and
`comm` needs two files. So you need a different implementation of the same idea:
loop over the range and test membership.

**Read the restrictions before choosing your algorithm.** The same problem has two
completely different shapes depending on whether temp files are allowed.

### Anchoring a user-supplied regex over the whole field
```sh
grep -E "^($regex)\|" "$file"
```
* `^` … `\|` pins **field 1 exactly** — the delimiter is the right-hand anchor here,
  not `$`, because there are five more fields after it.
* **The brackets around `$regex` are essential.** With `Nobel Prize for (chemistry|physics)`,
  writing `^$regex\|` gives
  `^Nobel Prize for (chemistry|physics)\|` — which happens to work — but with a
  top-level alternation like `physics|peace` you'd get `^physics|peace\|`, parsed as
  `(^physics)` or `(peace\|)`. The brackets make the anchors apply to the whole
  alternation.
* **Double quotes** so `$regex` expands. This is the deliberate exception to the
  single-quote rule.

Test the difference:
```sh
grep -cE "^(Nobel Prize)\|" awards.psv        # 0  -- no award is exactly that
grep -cE "^(Nobel Prize.*)\|" awards.psv      # all five Nobel categories
```

### Membership testing without temp files
```sh
if ! echo "$years" | grep -qx "$y"; then
```
* `echo "$years"` — quoted, so the newlines survive and grep sees one year per line.
* **`-x`** — match the **whole line**. Without it, `grep -q 194` would match `1940`,
  `1941`… and `grep -q 190` would match `1901`. **`-x` is what makes this correct.**
* `-q` — quiet, exit status only.
* `!` — we want the years that are **absent**.

`grep -qxF` (adding `-F` for a fixed string) is even safer; with pure digits there are
no regex metacharacters, so `-qx` suffices.

### The counting loop
```sh
y=$first
while [ "$y" -le "$last" ]; do
    ...
    y=$((y + 1))
done
```
POSIX arithmetic, `-le` so the last year is included. You *could* use
`seq "$first" "$last"` (it's on the permitted list) and pipe it into a `while read` —
also correct, and slightly shorter. The explicit counter avoids one process.

### `sort -nu` does two jobs
```sh
cut -d'|' -f2 | sort -nu
```
Numeric sort **and** dedupe. Several people win in the same year, so dedupe matters —
otherwise `head -n 1`/`tail -n 1` still work, but the membership list is needlessly long.

`sort -n` is essential: alphabetically `1901` < `999`, and mixing that up would give a
nonsense range.

### The no-match case
```sh
if [ -z "$years" ]; then
    echo "No award matching '$regex'"
    exit 0
fi
```
Must come **before** you compute `first`/`last`, or the `while` loop compares empty
strings and errors. `exit 0` — no match is a valid answer.

---
## PART 2 — THE APPROACH

1. Filter records whose **whole** field-1 name matches the regex; take field 2; `sort -nu`.
2. Empty → print the message, exit 0.
3. `first` = head, `last` = tail of the sorted years.
4. Loop `y` from first to last; if `y` is not in the list, print it.

Verify against all four examples in the spec. The third one
(`'Nobel Prize for.*'` → only 1940–42) is the strongest check: it proves your regex
matches *all five* Nobel categories and that you take the union of their years, not the
intersection of their gaps by accident.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash

regex=$1
file=$2

years=$(grep -E "^($regex)\|" "$file" | cut -d'|' -f2 | sort -nu)

if [ -z "$years" ]; then
    echo "No award matching '$regex'"
    exit 0
fi

first=$(echo "$years" | head -n 1)
last=$(echo "$years" | tail -n 1)

y=$first
while [ "$y" -le "$last" ]; do
    if ! echo "$years" | grep -qx "$y"; then
        echo "$y"
    fi
    y=$((y + 1))
done
```

Why the three examples give what they do:
* physics ran 1901–2021 with gaps 1916, 1931, 1934, 1940–42.
* chemistry's gaps overlap physics' only at 1916 and 1940–42, so requiring **neither**
  to have been awarded leaves those four.
* adding medicine, literature and peace narrows it to the war years 1940–42, when the
  Nobel Foundation suspended almost everything.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`grep -qx`, not `grep -q`.** Without `-x`, `190` matches `1901` and you'd report no
  gaps at all. This is the single most likely silent failure.
* **Brackets around `$regex`** when anchoring.
* **Double quotes** around `"$regex"` so it expands.
* **`$2` for the filename** — never hard-code `awards.psv`.
* **`sort -n`** for the range endpoints.
* **The `-z` guard first**, before computing first/last.
* **No temp files** — the restriction rules out `comm`, which is why the loop exists.
* **The exact message**, with the regex in single quotes:
  `No award matching 'COMP2041 Distinguished Achievers'`.
* Output is one year per line, ascending — which the loop gives you naturally.
