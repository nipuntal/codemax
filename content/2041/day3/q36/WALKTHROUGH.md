# Q36 Walkthrough — Award Report

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### Counting pairs, not single fields
```sh
cut -d'|' -f1,5
```
`-f1,5` keeps fields 1 and 5 **and the delimiter between them**, producing
`Nobel Prize for physics|Belgium`. That composite string becomes the thing you count.

**Counting combinations is just counting a composite key.** `sort | uniq -c` doesn't
care that the line contains two fields — it only sees text. So any "per X per Y"
question is `cut` the two fields, then the standard counting idiom.

Note `cut` outputs fields in **file order** regardless of how you write `-f`, and it
keeps the original delimiter — which is exactly what you want here, because you'll need
to split the pair apart again at the end.

### The two-key sort
```sh
sort -k1,1rn -k2,2
```
* `-k1,1rn` — key field 1 only, reverse, numeric → count descending
* `-k2,2` — key field 2, ascending → the tie-break

Per-key flags are **glued to the key**. `sort -rn -k2,2` would apply `-rn` globally and
reverse the tie-break too.

The fields here are whitespace-separated (`uniq -c` gives `     13 Nobel Prize for physics|Belgium`),
so key 2 is `Nobel` — only the first word! Every row here starts with `Nobel` or
`Fields` or `ACM`, so `-k2,2` alone barely discriminates; `sort` then falls back to
comparing whole lines, which is what actually produces the deterministic order you see.
If you want the tie-break to be explicit rather than incidental, use `-k2` (field 2
**to end of line**).

**That distinction matters:** `-k2,2` is "field 2 only", `-k2` is "field 2 onwards".
Most of the time you want `,N`; here, for a text tie-break spanning several words, `-k2`
is arguably more correct. Check the expected output either way.

### Reformatting with one `sed`
After `head` the line is:
```
     13 Nobel Prize for physics|Belgium
```
and you want:
```
13 Nobel Prize for physics (Belgium)
```
One substitution does all three jobs — strip the padding, split at the `|`, add the
parentheses:
```sh
sed -E 's/^ *([0-9]+) ([^|]*)\|(.*)$/\1 \2 (\3)/'
```
| piece | matches |
|---|---|
| `^ *`      | `uniq -c`'s padding — **outside** the groups, so it's discarded |
| `([0-9]+)` | group 1: the count |
| ` `        | the separator uniq inserts |
| `([^|]*)`  | group 2: the award — stops at the pipe |
| `\|`       | the literal pipe |
| `(.*)$`    | group 3: the country |

**Recognising that one `s///` can strip, split and rearrange at once is a real exam
speed-up.** The alternative is three stages.

`[^|]*` for group 2 rather than `.*`: `.*` is greedy and would swallow the pipe, leaving
group 3 empty.

---
## PART 2 — THE APPROACH

1. `cut -d'|' -f1,5` — the composite key.
2. `sort | uniq -c` — count.
3. `sort -k1,1rn -k2,2` — order with a tie-break.
4. `head -n 5`.
5. One `sed -E` to reformat.

Check the line count after each stage; build left to right.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash
cut -d'|' -f1,5 | sort | uniq -c | sort -k1,1rn -k2,2 | head -n 5 |
sed -E 's/^ *([0-9]+) ([^|]*)\|(.*)$/\1 \2 (\3)/'
```
(One line in your answer file.)

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`sort` before `uniq -c`.**
* **The tie-break.** The 4th and 5th rows both have 13, and there are more 13s just
  below the cut — so which two appear at all depends on the tie-break. Without
  `-k2,2` your output differs from the marker's. Run it with plain `sort -rn` and watch
  the bottom rows change between runs on different machines.
* **`[^|]*` not `.*`** for the award, or the country group comes out empty.
* **`^ *` outside the capture** so the padding is dropped.
* **`\|`** for the literal pipe under `-E`.
* `head -n 5` after the sort, never before.
* No `awk` — hence the `sed` for the reformatting.
