# Q18 Walkthrough — Print rm Commands for Duplicates

> **Read this after you have attempted the question.**

Warm-up for Q19 (the exam's symbolic-links question). Same nested-loop structure; Q19
additionally has to report *which* earlier file matched.

---
## PART 1 — TEACH

### Comparing file contents
```sh
cmp -s "$f" "$g"
```
* exit status **0** if identical, **1** if they differ.
* **`-s` is essential** — without it `cmp` prints
  `file0.txt file3.txt differ: char 1, line 1` and that lands in your output.

`diff -q` behaves similarly. `cmp` compares bytes and stops at the first difference, so
it's the right tool for "are these the same". Both are allowed here.

**Never compare with `wc -c` or checksums** unless the question says you may — two files
of the same size are not necessarily identical.

### The "compare against everything seen so far" loop
```sh
seen=""
for f in "$@"; do
    for g in $seen; do
        if cmp -s "$f" "$g"; then ... fi
    done
    ...
done
```
A nested loop: outer over the arguments, inner over the files already accepted.
That's O(n²) comparisons — with a handful of files, completely fine. **In an exam,
correct and obvious beats clever.**

### Building a list in a shell variable
Shell (POSIX) has no arrays. The idiom is a **space-separated string**:
```sh
seen="$seen $f"          # append
for g in $seen; do       # iterate -- NOTE: deliberately UNQUOTED
```
`$seen` unquoted is exactly the word-splitting you normally fight to avoid — here you
*want* it, so the string splits back into filenames.

This is the one place `"$var"` is wrong. It works only because the spec promises
filenames contain **no whitespace** — which is precisely why the spec says so. When a
question makes a promise like that, it is telling you which technique to use.

### `break` out of the inner loop
Once you've found one earlier match you're done with this file. `break` leaves the
**inner** loop only.

### A flag for the "nothing happened" message
```sh
found=0
...
        found=1
...
[ "$found" -eq 0 ] && echo "No duplicate files"
```
You can't know there were no duplicates until every file is processed, so the message
comes after the loop, guarded by a flag set inside it.

`A && B` runs B only if A succeeded — a compact one-line `if`.

### `exit 0` at the end
`[ "$found" -eq 0 ] && echo ...` is the **last command**, so its exit status becomes the
script's. When duplicates *were* found, the test is false and the script exits 1 —
which looks like failure to a marker checking the exit status.

`exit 0` on the final line fixes it. **A trailing `&&` or `[ ]` silently sets your exit
status**; this bites people in real scripts too.

---
## PART 2 — THE APPROACH

1. Keep a list of files accepted so far (`seen`).
2. For each argument, compare it with every file in `seen` using `cmp -s`.
3. Match → `echo "rm $f"`, set the flag, and **do not** add it to `seen`.
4. No match → add it to `seen`.
5. After the loop, if the flag never fired, print `No duplicate files`.
6. `exit 0`.

Step 3's "do not add it to `seen`" matters: a duplicate should be reported against the
**original**, not become a second original.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash

seen=""
found=0

for f in "$@"; do
    dup=0
    for g in $seen; do
        if cmp -s "$f" "$g"; then
            dup=1
            break
        fi
    done
    if [ "$dup" -eq 1 ]; then
        echo "rm $f"
        found=1
    else
        seen="$seen $f"
    fi
done

[ "$found" -eq 0 ] && echo "No duplicate files"
exit 0
```

The data: `file0=file3` (alpha), `file1=file6` (bravo), `file2=file5=file7` (charlie),
`file4` (delta) and `file8` (echo) unique. So the first example reports
`file3`, `file5`, `file6`.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`cmp -s`.** Forget the `-s` and `cmp`'s own message pollutes your output — the most
  common failure on this question.
* **Nothing is deleted.** No `rm` executed anywhere. Run the script twice; identical
  output.
* **Zero arguments** → the loop doesn't run, `found` stays 0 → `No duplicate files`.
  That falls out for free.
* **`for g in $seen` is unquoted on purpose.** Quoted, it would be one giant "filename".
* **Three copies of charlie**: `file5` and `file7` are both reported, both against
  `file2`. A duplicate must not join `seen`.
* **`exit 0`** so a successful run with duplicates doesn't exit non-zero.
* Output order follows the argument order.
