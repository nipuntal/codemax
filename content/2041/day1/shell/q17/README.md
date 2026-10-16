# Shell Q17 — while read: processing a file line by line  (full script)

**Difficulty:** ⭐⭐⭐ · **Target time:** 8 min

---
## LEARN FIRST

### Reading fields directly
`read` can split a line into several variables at once:
```sh
while IFS=: read -r user pass uid gid rest; do
    echo "$user has uid $uid"
done < /etc/passwd
```
* `IFS=:` sets the field separator **for this command only**.
* Extra fields all land in the **last** variable (`rest`). That's why you always
  supply a trailing catch-all variable.
* `< file` at the end of `done` feeds the whole loop.

Default `IFS` is whitespace, so `while read -r a b c` splits on spaces/tabs.

### Redirecting a loop's input and output
```sh
while read -r line; do ... done < input.txt > output.txt
```
Both redirections attach to the whole loop.

### Accumulating a total
```sh
total=0
while read -r n; do
    total=$((total + n))
done
echo "$total"
```
**Careful:** if you write `cat f | while read ...; done`, the loop runs in a
*subshell* and `total` is lost afterwards. Use `done < f` instead — this is a real
and famous bug.

---
## THE TASK

`scores.txt` has lines of the form:
```
NAME:COURSE:MARK
```

Write `q17.sh` that reads `scores.txt` on **stdin** and prints, for each line:
```
NAME scored MARK in COURSE
```
Then, as the **last line**, print:
```
average: A
```
where A is the integer average of all the marks (integer division).

Run as: `./q17.sh < scores.txt`

---
## HINTS
<details><summary>Hint 1</summary>
`while IFS=: read -r name course mark; do`
</details>
<details><summary>Hint 2</summary>
Keep a `total` and a `count`, add to them inside the loop, then print
`$((total / count))` after `done`.
</details>

## CHECK
```sh
./test.sh
```
