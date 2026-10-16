# Q24 Walkthrough — Award Lifespan

> **Read this after you have attempted the question.**

Warm-up for Q25 (the exam's *years an award was not given*). The hard parts — matching
the **whole** name against a *user-supplied* regex, and handling "no match" — are the
same.

---
## PART 1 — TEACH

### "The entire name must match" — anchoring a user's regex
The regex arrives as `$1`. You must apply it to the **whole** award name, not as a
substring:
```sh
grep -E "^($regex)$"
```
Three things are happening:
* `^` and `$` anchor it.
* **The brackets are essential.** If the user passes `physics|peace`, then
  `^physics|peace$` parses as `(^physics)` or `(peace$)` — the anchors bind tighter than
  the alternation and the whole thing means something else. `^(physics|peace)$` is
  correct.
* **Double quotes**, not single, because you need `$regex` to expand. That is the one
  place in this course where you deliberately don't single-quote a pattern.

`grep -Ex "$regex"` (`-x` = match whole line) does the same job without the brackets and
is arguably cleaner. Both are accepted; know why the bracket version needs its brackets.

### Get the distinct names first
```sh
names=$(cut -d'|' -f1 "$file" | sort -u | grep -E "^($regex)$")
```
Extract award names, dedupe, then filter. The result is a **newline-separated list in
one variable** — perfectly normal in shell.

### `[ -z "$var" ]` for "nothing matched"
```sh
if [ -z "$names" ]; then
    echo "No award matching '$regex'"
    exit 0
fi
```
`-z` is "the string is empty", `-n` is "non-empty". Quote the variable, always — with an
unquoted empty `$names`, `[ -z ]` becomes a different (and true) test by accident.

Note the message embeds the regex in **single quotes inside a double-quoted string**:
`"No award matching '$regex'"`. The single quotes are literal output characters; the
double quotes let `$regex` expand.

`exit 0` — no match is a valid answer, not an error.

### Iterating a multi-line variable
```sh
echo "$names" | while read -r name; do
```
`"$names"` **must be quoted** or the newlines collapse into spaces and you'd iterate
words instead of lines.

This puts the loop in a subshell (the Q9 trap) — but here nothing needs to survive the
loop, so it's fine. When you *do* need a value afterwards, restructure.

### Min, max and count from one sorted list
```sh
years=$(grep -E "^$name\|" "$file" | cut -d'|' -f2 | sort -n)
first=$(echo "$years" | head -n 1)
last=$(echo "$years"  | tail -n 1)
n=$(echo "$years"     | wc -l)
```
Compute the sorted list **once**, then take the ends and the length. `sort -n` is
essential — plain `sort` would make `1901` and `999` order alphabetically.

### `\|` when you build a pattern from a variable
```sh
grep -E "^$name\|" "$file"
```
The trailing `\|` pins the end of field 1, so `Nobel Prize for physics` doesn't also
match a hypothetical `Nobel Prize for physics and chemistry`.

---
## PART 2 — THE APPROACH

1. Extract and dedupe award names; filter with the anchored user regex.
2. Empty result → print the message, `exit 0`.
3. For each surviving name: collect its years, sort numerically, take first/last/count.
4. Print in the specified format. `sort -u` already gave you alphabetical order.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash

regex=$1
file=$2

names=$(cut -d'|' -f1 "$file" | sort -u | grep -E "^($regex)$")

if [ -z "$names" ]; then
    echo "No award matching '$regex'"
    exit 0
fi

echo "$names" | while read -r name; do
    years=$(grep -E "^$name\|" "$file" | cut -d'|' -f2 | sort -n)
    first=$(echo "$years" | head -n 1)
    last=$(echo "$years" | tail -n 1)
    n=$(echo "$years" | wc -l)
    echo "$name $first-$last ($((n)) awards)"
done
```

### Why `$((n))` and not `$n`
`wc -l` prints a **space-padded** number on macOS/BSD (`      59`) and a bare one on
GNU/Linux (CSE). `$n` would give you `(      59 awards)` on a Mac and `(59 awards)` on
CSE — the same script, two different outputs.

`$((n))` evaluates it as an integer, which drops the padding on both. One character,
and your practice results match what the marker will see.

(The same applies to `wc -w`, `wc -c` and `wc -L`.)

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`^(...)$` with the brackets**, or an alternation regex silently matches the wrong
  thing. Test with `'Nobel Prize for (physics|peace)'`.
* **`Nobel Prize` must match nothing** (no award has exactly that name) → the message.
  `Nobel Prize.*` must match five.
* **Double quotes around `"$regex"`** so it expands; single quotes would pass the
  literal text `$regex` to grep.
* **`sort -n`** for the years.
* **`[ -z "$names" ]`** with the variable quoted.
* **The filename comes from `$2`** — do not hard-code `awards.psv`. The spec says so
  explicitly, and a marker will run it on a different file.
* `wc -l` on a variable via `echo "$var" | wc -l` counts lines correctly, but note it
  reports **1** for an empty string — which is why the `-z` guard must come first.
* **`$((n))` to strip `wc`'s padding**, so the output is identical on macOS and CSE.
