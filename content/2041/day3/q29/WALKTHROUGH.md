# Q29 Walkthrough — Knight's Moves (exam Q12, 8 marks)

> **Read this after you have attempted the question.**

The last question on the paper, and the one people run out of time on. It is *not*
harder than Q28 — it is the same BFS with a different list of offsets. If you did Q28,
you have already written 95% of this.

---
## PART 1 — TEACH

### The only difference from Q28
```sh
# king:   all 8 neighbours
for dc in -1 0 1; do for dr in -1 0 1; do ...

# knight: 8 explicit L-shapes
for move in "1 2" "1 -2" "-1 2" "-1 -2" "2 1" "2 -1" "-2 1" "-2 -1"; do
```
Two squares one way, one square the other — all four sign combinations of `(±1, ±2)`
and `(±2, ±1)`. That's 8 offsets, and enumerating them literally is clearer (and less
error-prone) than trying to generate them.

Sanity check the list: from `d4` (c=4, r=4) they give
`e6 e2 c6 c2 f5 f3 b5 b3` — the eight squares the spec names. If your list is wrong,
that check finds it in ten seconds.

### Splitting a pair held in one string
POSIX shell has no arrays, so a "pair" is a two-word string:
```sh
dc=${move% *}      # strip the shortest " *" from the END   -> "1"
dr=${move#* }      # strip the shortest "* " from the FRONT -> "2"
```
The parameter-expansion family, worth having in your fingers:

| form | removes |
|---|---|
| `${v#pat}`  | shortest match from the **front** |
| `${v##pat}` | longest match from the front (the `basename` idiom) |
| `${v%pat}`  | shortest match from the **end** |
| `${v%%pat}` | longest match from the end |

Mnemonic: `#` starts a comment → front. `%` follows a number in `100%` → end. Doubling
means longest.

These are built-ins — no process, and allowed even when the external-program list is
tight.

### The BFS skeleton (unchanged from Q28)
```
frontier = {start};  seen = {start};  print frontier
while frontier not empty:
    next = {}
    for sq in frontier: for each offset: if on board and not seen: add to seen and next
    frontier = sorted(next); print if non-empty
```
* **`seen` prevents infinite looping** and implements the spec's word *new*.
* **`seen` starts containing the start square** — otherwise `a1` reappears on line 3.
* The loop ends by itself once every reachable square has been seen.

### Why the output looks the way it does
* From `a1` there are **7** lines: a knight needs 6 moves to reach `h8` from `a1`.
* The last line is just `h8` — the single hardest square to reach from the opposite
  corner. That lone `h8` is the signature of a correct solution; if your last line has
  more than one square, your `seen` set is leaking.
* From `d4` only 5 lines, because the centre reaches everything faster.
* A knight always changes square colour, but over two moves it can reach the same
  colour, so every square is eventually reachable — the board is fully connected for a
  knight.

### Formatting
```sh
frontier=$(echo "$next" | tr ' ' '\n' | grep -v '^$' | sort | tr '\n' ' ' | sed 's/ $//')
```
Split → drop blanks → sort → rejoin → **strip the trailing space**. That last `sed` is a
mark: without it every line ends in a space and the diff fails.

`[ -n "$frontier" ] && echo "$frontier"` — don't print an empty final line when the
search is exhausted.

---
## PART 2 — THE APPROACH

1. Steal the Q28 skeleton verbatim.
2. Replace the offset loop with the eight L-shapes.
3. Verify the offsets against the spec's `d4` example **before** running the whole thing.
4. Check `a1` produces 7 lines ending in a lone `h8`.

If you are short on time in the exam, note that the two helper functions and the whole
BFS loop are mechanical — **write them first and get partial output**, then fix the
offsets. Partial correct output scores; a syntax error does not.

---
## PART 3 — THE SOLUTION

See `solution/q29.sh` — identical to `q28/solution/q28.sh` except for the `for move`
line and the `${move%...}` / `${move#...}` split.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **The eight offsets.** Check them against the spec's `d4` list.
* **`seen` includes the start**, and is checked before adding to `next`.
* **On-board test in both dimensions**, which is what makes `a1` have only 2 moves.
* **Sorted, single-spaced, no trailing space.**
* **No empty line at the end.**
* **`./q29.sh a1` must end with a line containing only `h8`.**
* Test all three squares in the spec — corner, centre, and edge (`g2`) — they exercise
  different move counts.
* 60 seconds is generous for 64 squares; that limit exists to catch a missing `seen` set
  looping forever.
