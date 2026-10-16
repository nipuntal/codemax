# Shell Q18 — command substitution and looping over files  (full script)

**Difficulty:** ⭐⭐⭐ · **Target time:** 8 min

---
## LEARN FIRST

### Command substitution recap
```sh
n=$(wc -l < file)          # capture output
files=$(ls *.txt)          # careful: breaks on filenames with spaces
today=$(date +%Y-%m-%d)
```

### Looping over the LINES of command output
```sh
for word in $(cat words.txt); do ...      # splits on WHITESPACE (words, not lines)
while read -r line; do ... done < f       # splits on LINES  <- usually what you want
```
Know the difference. `for x in $(...)` word-splits; use it when you *want* words.

### Building filters into a script
A script can pipe internally:
```sh
count=$(grep -c "$pattern" "$file")
top=$(sort "$f" | uniq -c | sort -rn | head -n 1)
```

### Exit status and `&&` / `||`
```sh
grep -q x f && echo found
grep -q x f || echo "not found"
```
`A && B` runs B only if A succeeded. `A || B` runs B only if A failed.

### Useful: `basename` and `dirname`
```sh
basename /a/b/c.txt        -> c.txt
basename /a/b/c.txt .txt   -> c
dirname  /a/b/c.txt        -> /a/b
```
`basename f .txt` (stripping an extension) shows up constantly.

---
## THE TASK

The directory `data/` contains several `.txt` files.

Write `q18.sh` that, for every `.txt` file in `data/`, prints one line:
```
NAME has N words
```
where NAME is the filename **without** the `data/` prefix and **without** the `.txt`
extension, and N is the word count.

Print the lines in alphabetical order of filename (a plain glob already gives you
this). Then print a final line:
```
total: T
```
with T the sum of all the word counts.

Run as: `./q18.sh`

---
## HINTS
<details><summary>Hint 1</summary>
`for f in data/*.txt; do ... done`
</details>
<details><summary>Hint 2</summary>
`name=$(basename "$f" .txt)` and `n=$(wc -w < "$f")`
</details>

## CHECK
```sh
./test.sh
```
