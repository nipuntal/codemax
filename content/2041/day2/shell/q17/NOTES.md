# Notes — the running-maximum loop

This is the *most_lines* weekly test with a harder measurement.

## The running-maximum pattern
Every "which of these is the biggest" question is the same five lines:
```sh
best=""
best_n=-1
for f in "$@"; do
    n=$(measure "$f")
    if [ "$n" -gt "$best_n" ]; then
        best_n=$n
        best=$f
    fi
done
echo "$best"
```
Initialise the maximum to something smaller than any real value (`-1`, or seed it with
the first element). Compare with `-gt` so the **first** of several ties wins; `-ge`
would make the last one win. The spec here allows either, but know which you wrote.

## Measuring the longest line in a file
`wc -L` gives the longest line length — but `-L` is a **GNU extension** and not POSIX.
Under a strict marker it may not exist. The portable measurement is:
```sh
n=$(wc -L < "$f")                       # GNU only
n=$(awk '{print length}' "$f" | sort -n | tail -1)   # awk often banned
```
The filter-only route:
```sh
n=$(sed -E 's/./x/g' "$f" | sort | tail -n 1 | wc -c)
```
…is clever and fragile. **The clean POSIX answer is to let `sort` do it:**
```sh
n=$(wc -L < "$f")
```
if `-L` is permitted, and otherwise measure per line with a nested `while read`.

For this exercise `wc -L` is available on both macOS and CSE, so use it — but the
*notes* point stands: check whether the flag you're relying on is POSIX before you
build a script around it. `wc -l/-w/-c` are POSIX; `-L` is not.

## `wc -L < "$f"` vs `wc -L "$f"`
With a filename argument, `wc` prints the count **and the filename**:
```
58 long.txt
```
With input redirected it prints only the number. Inside `$( )` you want the bare
number — always redirect.

(On macOS the number is space-padded; `$((n))` normalises it. On CSE it isn't padded.
`[ "$n" -gt ... ]` copes with padding either way, so this only matters if you print it.)

## Edge cases
* One argument → the loop runs once, `best` is set, prints that file.
* An empty file → `wc -L` gives 0, which is still `-gt -1`, so an empty first file is
  handled by the `-1` seed.
* Ties → whichever comparison you chose. Say which in a comment.
* Quote `"$@"` and `"$f"` — filenames may contain spaces.
