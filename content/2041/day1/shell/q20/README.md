# Shell Q20 — a small real tool  (full script)

**Difficulty:** ⭐⭐⭐⭐ · **Target time:** 12 min

---
## LEARN FIRST — combining everything

This question uses nothing new. It uses **all of Q1–Q19 at once**, which is exactly
what a 10–15 minute exam question does.

Your checklist for any "write a script" question:

1. **Read the expected output first.** Match its format *exactly* — spaces, colons,
   capitalisation. Most lost marks are formatting, not logic.
2. **Usage check** at the top if the question mentions arguments.
3. **Pick your loop**: `for f in "$@"` (arguments), `for f in *.x` (files),
   `while read -r` (lines of input).
4. **Do the hard bit with a filter, not with shell logic.** Counting, sorting,
   extracting — pipe it. Shell loops are for the parts filters can't do.
5. **Test with the given sample immediately.** Don't write 30 lines then run.

### The pattern for "summarise a data file"
```sh
while IFS=, read -r a b c; do
    ...
done < "$file"
```
or, when the summary is really a count-and-sort, skip the loop entirely:
```sh
cut -d, -f2 "$file" | sort | uniq -c | sort -rn
```
Ask "can a pipeline do this?" *before* writing a loop. Usually it can.

---
## THE TASK

`sales.csv` looks like (with a header line):
```
date,region,item,amount
2026-08-01,north,widget,150
```

Write `q20.sh` that takes **one argument** — the CSV filename — and prints a report:

```
Regions:
  REGION: TOTAL
  ...
Top item: ITEM (COUNT sales)
Grand total: N
```

Details:
* The `Regions:` lines list each region **alphabetically**, indented by exactly two
  spaces, with that region's total `amount`.
* `Top item` is the item name appearing on the most rows, with its row count.
  (The data has no tie.)
* `Grand total` is the sum of every `amount`.
* Skip the header line.
* If the argument count is not 1, or the file doesn't exist, print
  `Usage: ./q20.sh <csvfile>` to stderr and exit 1.

Test invocation: `./q20.sh sales.csv`

---
## HINTS
<details><summary>Hint 1</summary>
Get the unique region names with `cut -d, -f2 | sort -u`, then loop over them and
sum with a nested pass. Small data — inefficiency is fine.
</details>
<details><summary>Hint 2</summary>
Summing a column: `grep ... | cut -d, -f4 | paste -sd+ - | bc`  … or just a
`while read` accumulator. The accumulator is easier to get right.
</details>
<details><summary>Hint 3</summary>
Top item is exactly the Q4 idiom:
`tail -n +2 "$f" | cut -d, -f3 | sort | uniq -c | sort -rn | head -n 1`
then pull the two fields out of that one line.
</details>

## CHECK
```sh
./test.sh
```
