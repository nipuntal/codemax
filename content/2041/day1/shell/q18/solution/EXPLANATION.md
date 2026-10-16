# Q18 explanation

```sh
for f in data/*.txt; do
```
The shell expands the glob **before the loop starts**, in alphabetical order, so
`$f` takes the values `data/animals.txt`, `data/greeting.txt`, … in order.
No `ls` needed — and `for f in $(ls ...)` would break on filenames with spaces.

```sh
    name=$(basename "$f" .txt)
```
`basename PATH SUFFIX` strips the directory *and* the given suffix.
`basename data/animals.txt .txt` → `animals`.

Pure-shell alternative (no external command):
```sh
name=${f##*/}        # strip everything up to the last /
name=${name%.txt}    # strip the .txt from the end
```
`${var##pattern}` removes the longest match from the front; `${var%pattern}` removes
the shortest match from the end. Worth knowing — they're faster and quote-safe.

```sh
    n=$(wc -w < "$f")
```
`< "$f"` again, so `wc` prints a bare number.
`-w` counts words, `-l` counts lines, `-c` counts bytes.

## Why `total` survives here
There's no pipe around the loop, so it runs in the main shell and `total` is still
alive after `done`. (See Q17's subshell trap.)

## If `data/` had no .txt files
The glob wouldn't expand and `$f` would literally be `data/*.txt`, giving a
"no such file" error. Real scripts guard with `[ -e "$f" ] || continue`.

## Portability note: `$((n))`
`wc -w < f` prints a bare number on Linux but a space-padded one on macOS BSD.
`$((n))` evaluates it as an integer, so output is identical on both. See Q15.
