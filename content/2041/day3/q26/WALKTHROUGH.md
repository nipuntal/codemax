# Q26 Walkthrough — Files By Depth

> **Read this after you have attempted the question.**

Warm-up for Q27 (the exam's directory-tree comparison). The technique that matters is
**`find` + strip the prefix to get a relative path**.

---
## PART 1 — TEACH

### `find`
```sh
find DIR                 every path under DIR, including DIR itself
find DIR -type f         only regular files
find DIR -type d         only directories
find DIR -name '*.c'     by name (quote the glob!)
find DIR -type f | sort  find's order is NOT sorted
```
`find` recurses for you — that's why directory questions use it rather than a
hand-written loop.

**`find` output is unordered.** If your output order matters, pipe into `sort`.

### Relative paths: strip the prefix
`find tree -type f` gives `tree/a/b/f3`. What you almost always want is the path
**relative to the root**, `a/b/f3`, because that's what you compare between two trees
(Q27) or measure (here).

```sh
sed "s|^$dir/||"
```
* **`|` as the delimiter** instead of `/`, because the text is full of slashes. Any
  character can delimit `s`, and choosing one that isn't in your data saves a pile of
  backslashes. This is the single biggest readability win in `sed`.
* **Double quotes** so `$dir` expands.

### Counting a character in a string
Depth = (number of `/` in the relative path) + 1.

Two ways:
```sh
sed 's|[^/]||g'          # delete everything that isn't a slash -> "//" 
tr -cd '/'               # same idea with tr: -c complement, -d delete
```
Then the **length** of what's left is the count. In shell, string length is
```sh
${#var}
```
a POSIX parameter expansion — no external program.

### `while read -r n rest`
```sh
uniq -c | while read -r n slashes; do
```
`read` with two variables splits the line on whitespace: the first word into `n`, **the
rest of the line** into `slashes`. That neatly consumes `uniq -c`'s
`      2 //` format — `read` ignores the leading padding for free, which is why it beats
`cut -d' '` here.

Always give `read` a trailing catch-all variable; extra fields all land in the last one.

### Why the `x` prefix
```sh
sed 's|^|x|'
```
A file at depth 1 has **zero** slashes, so its line would be empty — and `sort | uniq -c`
handles empty lines, but `read -r n slashes` would leave `slashes` unset and `${#slashes}`
would be 0 instead of… still 0. The `x` makes every line non-empty and shifts the length
by one, so `depth = ${#slashes}` directly. A small trick to avoid a special case.

---
## PART 2 — THE APPROACH

1. `find "$dir" -type f` — the files.
2. Strip the `$dir/` prefix to get relative paths.
3. Reduce each path to just its slashes, then prefix an `x`.
4. `sort | uniq -c` to count how many paths have each slash-count.
5. Convert the slash-string length into a depth and print.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash

dir=$1

find "$dir" -type f |
sed "s|^$dir/||" |
sed 's|[^/]||g' |
sed 's|^|x|' |
sort |
uniq -c |
while read -r n slashes; do
    echo "depth $(( ${#slashes} )): $n"
done
```

Trace `tree/a/b/f3`:
```
tree/a/b/f3     find
a/b/f3          strip prefix
//              keep only slashes
x//             prefix x
                -> length 3 -> depth 3   ✓
```

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`-type f`** — without it you'd count directories too.
* **Strip the prefix**, or every depth is inflated by however many slashes are in the
  argument (`./tree/a` vs `tree/a`).
* **`sort` before `uniq -c`.** Always.
* **`|` as the sed delimiter** on paths.
* **Double quotes** in `sed "s|^$dir/||"` so `$dir` expands.
* A trailing slash on the argument (`tree/`) would leave `//` in the prefix — real
  scripts strip it with `dir=${dir%/}`.
* `${#var}` is POSIX and needs no external program — useful when a question restricts
  the tool list.
