# Q27 Walkthrough — Compare Two Directory Trees (exam Q11, 8 marks)

> **Read this after you have attempted the question.**

The hardest shell question on the paper. It is not conceptually deep — it's four
counters — but there are several places to go wrong at once.

---
## PART 1 — TEACH

### The central idea: compare RELATIVE paths
`d1/b/c/one` and `d2/b/c/one` are "the same file" because their paths **relative to
their roots** are both `b/c/one`.

So the whole question is:
1. get the relative paths in tree 1
2. get the relative paths in tree 2
3. compare the two sets, and for the common ones compare sizes

```sh
find "$d1" -type f | sed "s|^$d1/||"
```
`find` gives `d1/b/c/one`; the `sed` strips the root, leaving `b/c/one`.

Use `|` as the sed delimiter — the data is full of slashes.

**Everything downstream must use relative paths**, and you rebuild the full path only
when you need to touch the file: `"$d2/$path"`.

### Two passes, not one
```sh
for path in ... tree 1 ...; do
    present in tree 2?  -> compare sizes (same / diff)
    absent?             -> only1
done

for path in ... tree 2 ...; do
    absent from tree 1? -> only2
done
```
The first loop can find three of the four numbers. It **cannot** find `only2`, because
it never visits a path that exists only in tree 2. Hence the second loop, which only
looks for the one missing case.

Trying to do it in one pass is where people tie themselves in knots. **Two simple
passes beat one clever one.**

### File size
```sh
s1=$(wc -c < "$d1/$path")
```
* `-c` counts **bytes**.
* **`<` redirect, not a filename argument.** `wc -c "$f"` prints `13 d1/file1` — the
  number *and the filename* — and `[ "13 d1/file1" -eq ... ]` is an error. With the
  redirect you get a bare number.

`stat` is on the permitted list too, but its options differ between GNU and BSD
(`stat -c%s` vs `stat -f%z`), so `wc -c <` is the portable choice. **When two tools do
the same job, pick the one whose interface is standard.**

### `[ -f "$d2/$path" ]`
`-f` = exists and is a regular file. Using `-e` would also match a directory with that
name, which would then break `wc -c`.

### Iterating find output
```sh
for path in $(find ... | sort); do
```
`$( )` unquoted, so the shell word-splits on whitespace — which is what you want here,
and is safe because the spec's trees have no spaces in filenames.

If filenames could contain spaces you'd need `find ... | while read -r path`, which is
more robust but puts the loop in a **subshell** — and then your four counters die with
it (the Q9 trap). With temp files permitted you could work around it; here the `for`
loop is simpler and the spec allows it.

**That trade-off — word-splitting vs subshell — is worth understanding, because the
right answer depends on which restriction the question imposes.**

### The output format
```sh
echo "$same $diff $only1 $only2"
```
One line, four integers, single spaces. Not four lines, no labels.

---
## PART 2 — THE APPROACH

1. Four counters at 0.
2. Pass 1 over tree 1's relative paths:
   * exists in tree 2 → compare `wc -c` sizes → `same` or `diff`
   * doesn't → `only1`
3. Pass 2 over tree 2's relative paths: not in tree 1 → `only2`
4. `echo` the four numbers.

Then build the example trees and walk through all four stages of the spec, checking
each number changes as described. **This question is best debugged by constructing the
examples yourself** — the marker's message won't tell you which of the four counts is
wrong.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash

d1=$1
d2=$2

same=0
diff=0
only1=0
only2=0

for path in $(find "$d1" -type f | sed "s|^$d1/||" | sort); do
    if [ -f "$d2/$path" ]; then
        s1=$(wc -c < "$d1/$path")
        s2=$(wc -c < "$d2/$path")
        if [ "$s1" -eq "$s2" ]; then
            same=$((same + 1))
        else
            diff=$((diff + 1))
        fi
    else
        only1=$((only1 + 1))
    fi
done

for path in $(find "$d2" -type f | sed "s|^$d2/||" | sort); do
    if [ ! -f "$d1/$path" ]; then
        only2=$((only2 + 1))
    fi
done

echo "$same $diff $only1 $only2"
```

Why the spec's four stages give what they do:
* Initially all three files exist in both at the same relative paths, and although the
  *contents* differ, `hello andrew` and `HELLO andrew` are both 13 bytes, `bye andrew`
  and `Bye Andrew` both 11, `1` and `2` both 2 → **3 0 0 0**.
* `hello everyone` is 15 bytes ≠ 13 → one moves from `same` to `diff` → **2 1 0 0**.
* Adding `d2/b/c/three` gives a path only in tree 2 → **2 1 0 1**.
* Adding `d1/b/three` gives a path only in tree 1. Note it is *not* matched with
  `d2/b/c/three` despite the same basename → **2 1 1 1**.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **Relative paths, not basenames.** `b/three` and `b/c/three` must not match. If your
  script uses `basename`, this is where it fails — and the spec calls the case out
  explicitly.
* **Strip the prefix with the right root** in each loop (`$d1` in the first, `$d2` in
  the second). Copy-pasting the first loop and forgetting to change `d1` to `d2` is the
  classic slip.
* **`wc -c < file`**, not `wc -c file`.
* **The second loop only counts absences** — don't recount sizes there or your `same`
  doubles.
* **`-type f`** in both `find`s, so directories aren't counted.
* **One line of output, four integers.**
* Sizes, not contents — the whole point of the first example is that three pairs of
  files have *different contents* but identical sizes and count as `same`.
* A trailing slash on an argument (`d1/`) leaves a doubled slash after stripping; real
  scripts do `d1=${1%/}`.
