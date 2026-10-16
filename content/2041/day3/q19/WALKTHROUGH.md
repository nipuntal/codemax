# Q19 Walkthrough — Symbolic Links (exam Q8, 8 marks)

> **Read this after you have attempted the question.**

Q18 was the same loop reporting *that* a file is a duplicate. This one must also report
**which earlier file** it duplicates — one extra variable, and one subtle rule.

---
## PART 1 — TEACH

### `ln -s TARGET LINKNAME`
```sh
ln -s file0.txt file3.txt
```
means "make `file3.txt` a symbolic link pointing at `file0.txt`".
**Target first, new name second** — the same argument order as `cp` and `mv`.

Getting it backwards is easy and the marker diffs your output, so say it out loud:
*"link to the original, from the duplicate."*

You never run this command — you print it.

### Remembering *which* file matched
Q18 used a boolean. Here you need the name:
```sh
original=""
for g in $seen; do
    if cmp -s "$f" "$g"; then
        original=$g
        break
    fi
done

if [ -n "$original" ]; then
```
`[ -n "$s" ]` is "the string is non-empty"; `[ -z "$s" ]` is "empty". Using the empty
string as "not found" works because filenames are never empty.

**`break` on the first match** — the spec says *any previous file*, and the expected
output always links to the **earliest** one. Without `break` you'd keep scanning and end
up with the *last* match. Compare example 1: `file7.txt` links to `file2.txt`, not to
`file5.txt`, even though both have identical contents and both come earlier.

That one `break` is the difference between matching the sample output and not.

### The rule that makes examples 2 and 3 work
When a file **is** a duplicate, it must **not** be added to `seen`.

Look at example 3 (`file8 file7 file6 file5 file4 file3 file2 file1 file0`):
```
ln -s file7.txt file5.txt
ln -s file7.txt file2.txt      <- file2 links to file7, not to file5
```
`file5` was already established as a duplicate of `file7`, so it is not an original.
When `file2` arrives, the only "charlie" file in `seen` is `file7`. If duplicates joined
`seen`, `file2` could have matched `file5` first and the output would differ.

**A duplicate is never an original.** That single rule reproduces all three orderings in
the spec.

### Order-dependence is the point
The same nine files produce three different outputs depending on argument order. That's
not a quirk — it's what "any **previous** file" means. Your loop must process arguments
strictly left to right and only ever look backwards.

### The repeated-arguments example — the rule everyone misses
```
./q19.sh file3.txt file0.txt file3.txt file0.txt file3.txt file0.txt
ln -s file3.txt file0.txt
```
**One** line, despite the pair being repeated three times.

Trace the naive script: `file3` goes into `seen`. `file0` matches it → reported. Then
the second `file3` arrives, is compared against `seen` (which contains `file3`), matches
itself, and you print the absurd
```
ln -s file3.txt file3.txt
```
A file linked to itself. Then `file0` is reported a second time. Five lines instead of
one.

The missing rule: **"for each file specified as an argument" means each *file*, not each
*argument*.** The same filename given twice is the same file, and must be processed
once. So you keep a second list of names already handled and skip repeats:

```sh
case " $processed " in
    *" $f "*) continue ;;
esac
processed="$processed $f"
```

`case " $processed " in *" $f "*)` is **the POSIX membership test for a
space-separated list**. The spaces around both `$processed` and `$f` are essential —
they make the match a whole-word one, so `file1` doesn't match inside `file10`. Worth
memorising; shell has no arrays and no `in` operator, and this is the substitute.

This example exists in the paper for exactly this reason. If your script prints
`ln -s file3.txt file3.txt`, this is the rule you're missing.

### The trailing `exit 0`
```sh
[ "$found" -eq 0 ] && echo "..."
exit 0
```
Without `exit 0`, a run that *did* find duplicates ends with a false `[ ]` and the
script exits **1**. Any last command's status becomes the script's status.

---
## PART 2 — THE APPROACH

1. `seen=""`, `found=0`.
2. For each argument, scan `seen` with `cmp -s`, recording the **first** match in
   `original` and `break`ing.
3. `original` non-empty → `echo "ln -s $original $f"`, set `found`.
4. `original` empty → append `$f` to `seen`.
5. After the loop, if `found` is still 0, print the message.
6. `exit 0`.

Then run **all five** examples from the spec, including the reordered ones. They exist
to catch exactly the mistakes above.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash

seen=""
found=0

for f in "$@"; do
    original=""
    for g in $seen; do
        if cmp -s "$f" "$g"; then
            original=$g
            break
        fi
    done

    if [ -n "$original" ]; then
        echo "ln -s $original $f"
        found=1
    else
        seen="$seen $f"
    fi
done

[ "$found" -eq 0 ] && echo "No files can be replaced by symbolic links"
exit 0
```

Contents: `file0=file3` (alpha), `file1=file6` (bravo), `file2=file5=file7` (charlie),
`file4` (delta), `file8` (echo).

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`cmp -s`** — without `-s`, cmp's own "differ" messages appear in your output.
* **`break` on the first match**, so links point at the earliest original.
* **Duplicates never join `seen`** — this is what makes the three orderings come out as
  specified.
* **`ln -s ORIGINAL DUPLICATE`**, in that order.
* **Nothing is created or modified.** Run twice; identical output, and `ls -l` shows no
  links.
* **Zero arguments** → the message, and it must not error.
* **Repeated arguments** → each filename handled once; never `ln -s X X`.
* **Output order** follows the argument list. (The paper's first example lists the same
  four links grouped by target; its second and third examples are in argument order, so
  argument order is the rule.)
* **`exit 0`** at the end.
* **`for g in $seen` unquoted** — the deliberate word-split. Safe only because the spec
  promises no whitespace in filenames.
* The exact message: `No files can be replaced by symbolic links`.
