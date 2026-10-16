# Q13 Walkthrough — Mirrored Files (exam Q6, 8 marks)

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### Reframe: "mirrored" is "equal to the reverse"
```
file1 is mirrored with file2   ⟺   lines1 == reversed(lines2)
```
Once you write that down, the whole question becomes an element-wise comparison of two
lists — which you already did in Q12. Don't index backwards through file 2 with
`lines2[n - 1 - i]`; **reverse it once**, then compare position by position.

```python
reversed2 = lines2[::-1]
for i in range(len(lines1)):
    if lines1[i] != reversed2[i]:
```
`lines2[n-1-i]` is equivalent and is where off-by-one errors come from. One extra list
is worth the clarity.

### `[::-1]` reverses
A slice with step −1. Works on lists and strings, returns a **new** object.

**Not** `lines2.reverse()` — that mutates in place and returns `None`, so
`x = lines2.reverse()` sets `x` to `None`. Any method that changes an object in place
returns `None` (`.sort()`, `.append()`, `.reverse()`, `.extend()`).

**Not** `reversed(lines2)` on its own — that's an *iterator*. `lines1 == reversed(l2)` is
always `False` because a list is never equal to an iterator. Use `list(reversed(l2))` or
the slice.

### Three outcomes, checked in the right order
The spec is a priority list:
1. **different line counts** → report the counts
2. else **first differing position** → report the line number
3. else → `Mirrored`

Check the length **first**. If you compared element-wise on lists of different lengths
you'd either crash or compare only the overlap and report the wrong thing.

### `sys.exit(0)` after printing
The spec says *always exactly one line of output*. After printing a failure message you
must stop. Options:
* `sys.exit(0)` — leaves the program immediately, from anywhere.
* `break` + `for ... else` (as in Q12).
* An `if/elif/else` chain.

All fine. `sys.exit()` is the bluntest and hardest to get wrong when there are three
mutually exclusive outcomes.

Note `sys.exit(0)` — status 0 means success. This is **not** an error condition; the
program correctly determined the files aren't mirrored. Using `sys.exit(1)` would be
wrong: a non-zero status means the program failed.

### The line number is in the FIRST file
```python
print(f"Not mirrored: line {i + 1} different")
```
`i` indexes `lines1`, so `i + 1` is the 1-based line number in file 1 — which is what
the spec asks for. That's why swapping the arguments gives a *different* number:

```
file1 = hi, Andrew          file2 = Dylan, hello
q13.py file1 file2:  reversed2 = [hello, Dylan]; hi != hello at i=0 -> "line 1"
q13.py file2 file1:  reversed1 = [Andrew, hi];   Dylan != Andrew at i=0 -> "line 1"
```
Work through the sample outputs and confirm your indexing reproduces them — the exam
gives both orderings precisely to catch a symmetric-looking bug.

### `readlines()` keeps the `\n`
Comparing `'hi\n'` with `'hi\n'` is fine — both sides have it. Consistency is what
matters, not whether it's stripped. Only strip if you *print* the lines.

---
## PART 2 — THE APPROACH

1. Read both files into lists.
2. Lengths differ → print the counts message, exit.
3. Reverse the second list.
4. Walk both in step; first mismatch → print `line i+1`, exit.
5. Fall through → `Mirrored`.

Then check every sample in the question, **including both argument orders**.

---
## PART 3 — THE SOLUTION

```python
with open(sys.argv[1]) as f:
    lines1 = f.readlines()
with open(sys.argv[2]) as f:
    lines2 = f.readlines()

if len(lines1) != len(lines2):
    print(f"Not mirrored: different number of lines: {len(lines1)} versus {len(lines2)}")
    sys.exit(0)

reversed2 = lines2[::-1]

for i in range(len(lines1)):
    if lines1[i] != reversed2[i]:
        print(f"Not mirrored: line {i + 1} different")
        sys.exit(0)

print("Mirrored")
```

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **The exact message text.** `Not mirrored: different number of lines: 2 versus 1` —
  the colons, the word `versus`, the spacing. Transcribe it; don't paraphrase. This is
  a pure formatting mark and a `diff` catches any slip.
* **Length check first**, before any element comparison.
* **First difference only.** Without an exit you print one line per mismatch.
* **`i + 1`**, and it refers to file 1. Both argument orders are tested.
* **Exactly one line of output** in all three cases — including `Mirrored`.
* A file that is a palindrome of itself (`q13.py a a` where `a` is symmetric) should say
  `Mirrored`. Worth a quick check.
* `sys.exit(0)`, not `sys.exit(1)` — the program succeeded.
