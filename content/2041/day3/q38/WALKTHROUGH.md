# Q38 Walkthrough — Word Ladder

> **Read this after you have attempted the question.**

The Q28/Q29 BFS again, but on an **implicit graph**: the neighbours aren't computed from
coordinates, they're discovered by testing every dictionary word.

---
## PART 1 — TEACH

### Same BFS, different neighbour function
```
frontier = {start};  seen = {start};  print
while frontier:
    next = {}
    for w in frontier:
        for each neighbour of w not in seen:
            add to seen and next
    frontier = sorted(next); print if non-empty
```
Identical to the knight. The **only** thing that changes between Q29 and Q38 is how you
enumerate neighbours:

| problem | neighbours |
|---|---|
| knight | 8 offsets, computed |
| word ladder | every dictionary word differing in one letter, **searched** |

**Recognising that two very different-sounding problems share one algorithm is the
skill.** Write the BFS once and swap the neighbour step.

### Comparing two words character by character
```sh
neighbour() {
    a=$1; b=$2
    [ "${#a}" -ne "${#b}" ] && return 1
    diff=0
    i=1
    while [ "$i" -le "${#a}" ]; do
        ca=$(echo "$a" | cut -c"$i")
        cb=$(echo "$b" | cut -c"$i")
        [ "$ca" != "$cb" ] && diff=$((diff + 1))
        i=$((i + 1))
    done
    [ "$diff" -eq 1 ]
}
```
* `${#a}` — **string length**, a POSIX parameter expansion, no external process.
* `cut -c"$i"` — the i-th character.
* Length check first: different lengths can't be neighbours, and it avoids indexing past
  the end.

### A function's exit status is its return value
```sh
    [ "$diff" -eq 1 ]
}
...
if neighbour "$w" "$cand"; then
```
The **last command's exit status becomes the function's**, so ending with a bare `[ ]`
makes the function usable directly as an `if` condition. No `echo`, no `$( )`.

That is the idiomatic way to write a shell predicate. Compare with a function that
`echo`s a value, which you'd have to capture — use `echo` for functions returning
*data*, exit status for functions returning *yes/no*.

`return 0` is true, `return 1` is false — inverted from C.

### Efficiency, and why it doesn't matter here
For each frontier word you scan the **whole dictionary**, and for each candidate you
compare character by character. That's O(frontier × dict × wordlen), with a `cut`
process per character.

With 18 words: instant. With 10,000 words it would crawl. The exam gives you small
inputs precisely so the obvious algorithm is acceptable — **don't optimise until the
spec forces you to.**

(The fast version indexes words by "wildcard patterns" like `c?t`, which is a nice idea
and completely unnecessary here.)

### The trailing `exit 0`
```sh
[ -n "$frontier" ] && echo "$frontier"
```
is the last command in the loop, and on the final iteration it is **false** — so the
script would exit with status 1. `exit 0` at the end fixes it.

Any trailing `[ ]` or `&&` silently sets your script's exit status. Worth checking with
`echo $?` before you submit.

---
## PART 2 — THE APPROACH

1. Read the dictionary into a variable (a space-separated word list).
2. Write `neighbour a b` as a predicate ending in `[ "$diff" -eq 1 ]`.
3. Drop it into the BFS skeleton from Q28/Q29.
4. `exit 0`.

---
## PART 3 — THE SOLUTION

See `solution/q38.sh`.

From `cat` the layers are:
```
cat
bat cap cot hat          one letter changed
bag cog cup dot hot lot  two changes from cat
big bog dog hop log
top
tip
```
Six layers — `tip` is the furthest word from `cat` in this dictionary.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **The `seen` set**, including the start — without it the search never terminates.
* **Check `seen` before calling `neighbour`**, not after: it's the cheap test.
* **Length check first** in `neighbour`, or `cut -c` runs off the end of the shorter
  word.
* **Exactly one differing character** — zero (the same word) is not a neighbour, and the
  `seen` set would exclude it anyway.
* **Sorted output, single spaces, no trailing space.**
* **No empty final line.**
* **`exit 0`.**
* The dictionary is read once into a variable; re-reading the file inside the inner loop
  would be needlessly slow but not wrong.
