# Q10 Walkthrough — The Missing Integer (exam Q4, 8 marks)

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### Reframe the problem before writing anything
"Find the missing integer" sounds like a loop-and-compare problem. It isn't.
It is **set subtraction**:

> the answer is (all integers from n to m) **minus** (the integers actually in the file)

Once you see that, the tools pick themselves: `seq` builds the first set, the file is
the second set, and `comm` subtracts.

**Turning a problem into a set operation is the single most valuable move in shell
scripting.** Look for it whenever a question says "missing", "only in", "in both",
"not present".

### `seq`
```sh
seq 5           # 1 2 3 4 5
seq 3 7         # 3 4 5 6 7
seq 10 -1 1     # counting down
```
It is on the permitted list here (unlike some weekly tests, which ban it precisely to
force a `while` loop — **always read the list**).

### `comm` — the set-operations filter
```sh
comm file1 file2
```
prints three columns: lines only in file1, lines only in file2, lines in both.
Suppress columns with `-1`, `-2`, `-3`:

| command | meaning |
|---|---|
| `comm -23 a b` | lines only in **a** (a − b) |
| `comm -13 a b` | lines only in **b** (b − a) |
| `comm -12 a b` | lines in **both** (a ∩ b) |

Read the flags as "suppress these columns", so `-23` keeps only column 1.

**`comm` requires both inputs to be sorted**, in the *same* collating order. This is the
trap: if you sort one numerically (`sort -n`) and the other alphabetically (`sort`),
`comm` silently produces garbage. Sort **both the same way**.

Here the safe choice is plain `sort` (alphabetical) for both, because that's a
consistent order even if it isn't numeric — you're only testing membership, not
ordering, and there's at most one answer.

### Finding n and m
```sh
first=$(sort -n "$file" | head -n 1)
last=$(sort -n "$file" | tail -n 1)
```
`sort -n` is essential — plain `sort` would put `1005` before `999` alphabetically.
`head -n 1` / `tail -n 1` take the ends.

### Why "print nothing" needs no `if`
If nothing is missing, `comm -23` outputs nothing and the script produces no lines.
**The natural code already satisfies the edge case** — check for that before writing a
branch. Every `if` you don't write is a bug you can't have.

### Temp files, safely
```sh
tmp=$(mktemp)
```
`mktemp` creates a uniquely-named file and prints its name. A fixed name like
`/tmp/mine` collides if the script runs twice at once.

`$$` (the process ID) is a lighter-weight alternative used in the sample solution.
Either is accepted; clean up with `rm -f` when done.

### The alternative with no temp files
Some questions forbid temp files. Then you'd use process substitution — except that is
**bash-only** and banned under `#!/bin/dash`. In POSIX shell your options are temp
files or a different algorithm entirely, e.g.:
```sh
sort -n "$file" | uniq        # then walk the sorted list looking for a gap
```
with a `while read` loop comparing each value to the previous + 1. Longer, but no temp
files. Know both; pick based on the question's rules.

---
## PART 2 — THE APPROACH

1. Find `n` and `m`: sort numerically, take the first and last.
2. Generate every integer from n to m: `seq "$n" "$m"`.
3. Subtract what's in the file: `comm -23 <(generated) <(actual)`.
4. **Sort both inputs identically** before `comm`.
5. Clean up the temp files.

Test all four data files, especially `numbers_4.txt`, which has **no** missing integer
and must print nothing.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash

file=$1

first=$(sort -n "$file" | head -n 1)
last=$(sort -n "$file" | tail -n 1)

seq "$first" "$last" | sort > /tmp/q10_all.$$
sort "$file" > /tmp/q10_have.$$
comm -23 /tmp/q10_all.$$ /tmp/q10_have.$$
rm -f /tmp/q10_all.$$ /tmp/q10_have.$$
```

* `$$` is the process ID, making the temp names unique per run.
* Both files go through **plain `sort`**, so `comm` sees a consistent order.
* `comm -23` prints only the lines in the generated range that are absent from the file
  — the missing integer, or nothing.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`numbers_4.txt` has no gap** → your script must print *nothing*, not a blank line,
  not an error. Test it explicitly.
* **Sort both `comm` inputs the same way.** Mixing `sort -n` and `sort` is the classic
  silent failure. Symptom: garbage output on `numbers_3.txt` (4-digit numbers), which
  is where alphabetical and numeric orders diverge.
* **`sort -n` for finding n and m**, plain `sort` for `comm`. Two different jobs, two
  different sorts — deliberately.
* `numbers_3.txt` uses 1000–1010, chosen precisely so an alphabetical/numeric mix-up
  shows up.
* Clean up your temp files. A marker running the script 20 times shouldn't fill `/tmp`.
* Quote `"$file"` throughout.
* The spec says *at most one line of output* — `comm -23` gives one line or zero. If
  yours can print two, your range is wrong.
