# Q32 Walkthrough — Transpose A Table

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### The insight: a transposed row IS a column
Output row *i* is exactly column *i* of the input, laid out horizontally.
And `cut -d'|' -fi` **already gives you column i** — one field per line:

```sh
cut -d'|' -f1 table.psv
name
alice
bob
carol
```
So the whole question is: for each column, extract it and turn the newlines into pipes.

```sh
cut -d'|' -f1 | tr '\n' '|' | sed 's/|$//'
```
→ `name|alice|bob|carol`

**Look for the tool that already does the hard part.** Transposition sounds like it
needs a 2D array; it needs `cut` in a loop.

### `tr '\n' '|'` and the trailing delimiter
`tr` replaces **every** newline, including the final one, so you get
`name|alice|bob|carol|` with a trailing pipe. Strip it:
```sh
sed 's/|$//'
```
Then `echo` supplies the newline that `tr` consumed.

This "join lines with a separator, then remove the trailing one" pattern is the shell
equivalent of Python's `'|'.join(...)`, and the `sed` is the part everyone forgets.

### stdin can only be read once
The script needs **two** passes over the data: one to count the columns, and one per
column. But stdin is a stream — once consumed, it's gone.

```sh
tmp=$(mktemp)
cat > "$tmp"
```
Slurp stdin into a temp file first, then read that file as many times as you like.

**Whenever a question reads stdin and needs more than one pass, the first line of the
script is a slurp.** (If temp files were banned you'd have to hold the data in a shell
variable instead — `data=$(cat)`.)

`mktemp` gives a unique name; `rm -f "$tmp"` at the end cleans up.

### Counting the fields
```sh
ncols=$(head -n 1 "$tmp" | tr '|' '\n' | wc -l)
```
Turn the separators into newlines and count the lines. With 3 fields you get 3 lines,
because `head -n 1` supplies a trailing newline and `tr` adds two more.

Careful with `wc -l` padding on macOS — wrap in `$(( ))` if you print it. Here it's only
used in `[ "$i" -le "$ncols" ]`, which tolerates the spaces.

### The counting loop
```sh
i=1
while [ "$i" -le "$ncols" ]; do
    ...
    i=$((i + 1))
done
```
`seq 1 "$ncols"` in a `for` is equivalent when `seq` is permitted; the `while` form
always works.

---
## PART 2 — THE APPROACH

1. Slurp stdin to a temp file.
2. Count fields in the first row.
3. For `i` in 1..ncols: `cut -d'|' -f$i`, join with `|`, strip the trailing `|`, `echo`.
4. Remove the temp file.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash

tmp=$(mktemp)
cat > "$tmp"

ncols=$(head -n 1 "$tmp" | tr '|' '\n' | wc -l)

i=1
while [ "$i" -le "$ncols" ]; do
    cut -d'|' -f"$i" "$tmp" | tr '\n' '|' | sed 's/|$//'
    echo
    i=$((i + 1))
done

rm -f "$tmp"
```

The bare `echo` after the pipeline is not decoration: `tr` ate the last newline and
`sed` printed without one, so `echo` terminates the line.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **Slurp stdin first.** Without the temp file, `head -n 1` consumes part of the stream
  and the `cut`s see nothing.
* **Strip the trailing `|`.** Easy to miss and immediately visible in a diff.
* **The `echo` after each column**, or all the output lands on one line.
* **Quote `-f"$i"`** and `"$tmp"`.
* **Clean up the temp file.**
* A table with one row transposes to one column (n lines of one field each) — worth a
  quick test.
* `paste -d'|' -s` can join lines too — `cut -d'|' -f1 "$tmp" | paste -d'|' -s -` is a
  neat alternative to the `tr`/`sed` pair, and `paste` is on the permitted list.
