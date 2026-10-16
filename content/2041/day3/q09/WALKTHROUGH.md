# Q9 Walkthrough — Column Statistics

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### Reading a file line by line
```sh
while read -r line; do
    ...
done < "$1"
```
* `read` takes one line from stdin into a variable and returns **false at end of
  input**, so the loop terminates by itself.
* `-r` means "don't treat backslashes specially". Always use it.
* `< "$1"` on the `done` feeds the **whole loop** from the file.

### The subshell trap — the most famous bug in shell scripting
```sh
cat "$1" | while read -r n; do
    sum=$((sum + n))
done
echo "$sum"        # prints 0 !!
```
Each stage of a pipeline runs in its **own process**. The loop's `sum` lives and dies
in that process, so the `echo` afterwards sees the original value.

`done < "$1"` keeps the loop in the main shell, so the accumulators survive. **If a
loop needs to leave a value behind, never put a pipe in front of it.**

### Shell arithmetic
```sh
count=$((count + 1))
sum=$((sum + n))
echo "$((sum / count))"
```
* `$(( ))` is a shell **built-in** — allowed even when "no external programs" is a rule.
* Inside `$(( ))`, variables don't need a `$`: `$((sum + n))` and `$(($sum + $n))` are
  the same.
* `/` is **integer division**, truncating toward zero. `252/6` is 42; `74/11` is 6, not
  6.7. The shell has **no floating point at all** — if a question wants decimals you
  need `bc`, `awk`, or Python.
* `%` is remainder.

`expr` is the old external way (`sum=$(expr $sum + $n)`) and forks a process per
iteration. Use `$(( ))`.

### Initialise before the loop
```sh
count=0
sum=0
```
An unset variable expands to the empty string, and `$(( + 5))` is a syntax error on the
first iteration. Two lines that are easy to forget.

### Redirection on a compound command
`< "$1"` attached to `done` applies to the whole loop. The same works for `for`, `if`
and `{ }`:
```sh
for f in *; do echo "$f"; done > list.txt
{ echo header; cat body; } > out.txt
```
That's a genuinely useful trick — one `open()` instead of one per iteration.

---
## PART 2 — THE APPROACH

1. Two accumulators, initialised to 0 **before** the loop.
2. `while read -r n; do ... done < "$1"` — no pipe.
3. Increment both inside.
4. Print the three lines after `done`, computing the mean with `$(( ))`.

Check with `dash -n q09.sh` (syntax only, doesn't run) before you test.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash

count=0
sum=0

while read -r n; do
    count=$((count + 1))
    sum=$((sum + n))
done < "$1"

echo "count: $count"
echo "sum: $sum"
echo "mean: $((sum / count))"
```

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **No pipe before the loop.** `cat "$1" | while ...` gives `count: 0, sum: 0`.
* **Initialise the accumulators.** Otherwise the first `$((sum + n))` fails.
* **Integer division.** `74 / 11` is `6`. If the expected output showed `6.7` you would
  need a different tool entirely — read the sample before choosing your approach.
* **Division by zero** if the file were empty. The spec doesn't require the guard, but
  a robust script would add `[ "$count" -eq 0 ] && { echo "count: 0"; exit 0; }`.
* `wc -l < "$1"` would also give the count — but you need the sum anyway, so one loop
  does both. Note `wc -l < f` (bare number) versus `wc -l f` (number **and filename**);
  in a `$( )` you almost always want the redirect form.
* Quote `"$1"` — a filename with a space breaks the redirect otherwise.
