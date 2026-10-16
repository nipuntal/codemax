# Q28 Walkthrough — King's Moves

> **Read this after you have attempted the question.**

Warm-up for Q29 (the exam's knight). The **breadth-first search** skeleton is identical;
only the move offsets change.

---
## PART 1 — TEACH

### This is breadth-first search
"All squares reachable in exactly k moves" is BFS, and the output *is* the BFS layers:

```
frontier = {start}
seen     = {start}
print frontier
while frontier is not empty:
    next = {}
    for each square in frontier:
        for each legal move from it:
            if the destination is not in seen:
                add it to seen and to next
    frontier = sorted(next)
    print frontier
```

Three pieces of state and nothing else:
* **`frontier`** — the squares found on the previous line
* **`seen`** — every square found so far, ever
* **`next`** — what we're building for this line

**The `seen` set is what makes it terminate.** Without it a king bounces between two
squares forever. It is also what makes the output correct — the spec says *new* squares.

### Representing the board
Squares are `a1`..`h8`: a letter and a digit. Arithmetic needs numbers, so convert:
```
a b c d e f g h
1 2 3 4 5 6 7 8
```
The rank is already a digit. Only the file needs mapping, both ways.

```sh
files="a b c d e f g h"

file_index() {          # a -> 1
    i=1
    for f in $files; do
        [ "$f" = "$1" ] && echo "$i" && return
        i=$((i + 1))
    done
}
```
POSIX shell has no arrays and no `tr`-style index lookup, so a small loop over a
space-separated list is the idiom. A function that `echo`s its result is how you
"return a value" — the caller captures it with `$( )`.

`cut -c1` and `cut -c2` split the square into its two characters.

### The move offsets
A king moves to all eight neighbours, i.e. every `(dc, dr)` in `{-1,0,1}²` **except**
`(0,0)`:
```sh
for dc in -1 0 1; do
    for dr in -1 0 1; do
        [ "$dc" -eq 0 ] && [ "$dr" -eq 0 ] && continue
```
For the knight (Q29) you'd instead enumerate the eight L-shaped offsets explicitly.
**Everything else in this script stays the same** — which is the point of doing this one
first.

### Staying on the board
```sh
[ "$nc" -lt 1 ] || [ "$nc" -gt 8 ] && continue
```
Reject anything outside 1..8 in either dimension. This is why a king on `a1` has 3 moves
and one on `d4` has 8.

### The membership test
```sh
case "$seen" in
    *" $new "*) continue ;;
esac
```
`seen` is a space-separated string **with a leading and trailing space**, so every entry
is surrounded by spaces and `*" $new "*` matches whole entries only. Without the
surrounding spaces, `a1` would match inside `a10` (not an issue on a chessboard, but the
habit matters).

This is the POSIX "is X in my list" idiom — shell has no sets.

### Sorting the frontier
```sh
frontier=$(echo "$next" | tr ' ' '\n' | grep -v '^$' | sort | tr '\n' ' ' | sed 's/ $//')
```
Split on spaces into lines, drop blanks, sort, rejoin with spaces, remove the trailing
one. Clumsy-looking, but it's the standard way to sort a space-separated list in shell.

The `sed 's/ $//'` matters: without it every output line ends in a space and a diff
fails.

---
## PART 2 — THE APPROACH

1. Helpers to convert file letter ↔ index.
2. `frontier=$1`, `seen=" $1 "`, print the start.
3. Loop while the frontier is non-empty:
   * for each square, for each of the 8 offsets, compute the destination
   * skip off-board and already-seen
   * add to `seen` and `next`
   * sort `next` into `frontier`, print it if non-empty
4. Termination is automatic once every reachable square is in `seen`.

---
## PART 3 — THE SOLUTION

See `solution/q28.sh`. The structure is exactly the pseudocode above.

Sanity checks on the output:
* From `a1`, a king needs 7 moves to reach `h8` → 8 lines total. ✓
* From `d4` (near the middle) only 5 lines. ✓
* Line 2 from `a1` has 3 squares (corner), from `d4` has 8 (open board). ✓

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **The `seen` set.** Without it the script never terminates.
* **`seen` must include the start**, or you'd revisit it on line 3.
* **Off-board rejection** in both dimensions.
* **Sorted output, single spaces, no trailing space.**
* **Stop when nothing new is found** — don't print an empty final line.
* **Corner vs centre starts** exercise different move counts; test `a1`, `d4` and `h8`.
* Performance is a non-issue — 64 squares. The 60-second limit in the spec is there to
  catch an accidental infinite loop, which is another way of saying *the `seen` set is
  the mark*.
