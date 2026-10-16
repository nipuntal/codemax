# Q20 explanation

## Usage check
```sh
if [ $# -ne 1 ] || [ ! -f "$1" ]; then
```
Two conditions joined with `||`. `!` negates a test, so `[ ! -f "$1" ]` is
"$1 is not a regular file". Note this is *one* `if`, not two.

## The regions loop
```sh
for region in $(tail -n +2 "$file" | cut -d, -f2 | sort -u); do
```
* `tail -n +2` skips the header.
* `cut -d, -f2` = the region column.
* `sort -u` = sorted, deduplicated → `east north south west`.
* `for x in $(...)` word-splits on whitespace, which is exactly right here since
  region names have no spaces.

Then for each region we re-read the file and sum matching rows.
Yes, that's O(regions × rows) — with 12 rows, who cares. **In an exam, correct and
obvious beats clever and broken.**

## `done < <(command)` — process substitution
```sh
done < <(tail -n +2 "$file")
```
`<(cmd)` makes `cmd`'s output look like a *file*, so we can redirect it into the
loop with `<`. Why not `tail ... | while ...`? Because a pipe puts the loop in a
subshell and `total` would be lost (the Q17 trap). This is bash-only; in `dash`
you'd write to a temp file or restructure.

**Simpler exam-safe alternative** that avoids `<( )` entirely:
```sh
total=$(grep ",$region," "$file" | cut -d, -f4 | paste -sd+ - | bc)
```
or keep the loop but put the `echo` inside the pipeline.

## Top item
```sh
top=$(tail -n +2 "$file" | cut -d, -f3 | sort | uniq -c | sort -rn | head -n 1)
```
The Q4 counting idiom, then `head -n 1`. `$top` is now one line like `   6 widget`.
`awk '{print $1}'` / `'{print $2}'` split it — awk ignores the leading spaces for
free, which is why it beats `cut` here.

## What the marker is looking for
* header skipped
* exact output format (two-space indent, the `(N sales)` parens)
* usage message on stderr + exit 1
* regions in sorted order

Format is worth as much as logic. Copy the expected output literally.
