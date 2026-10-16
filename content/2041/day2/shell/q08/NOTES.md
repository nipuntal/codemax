# Notes — dedupe on one field, group by another, then reverse the columns

Three separate difficulties stacked. Take them one at a time.

## 1. "Distinct students" means dedupe first
A student appears once per course. Counting raw records counts COMP2041 twice.
Keep `zid|program`, `sort -u`, then throw the zid away — the Q3 shape again, but this
time the key you keep afterwards is the **program**, not the name.

```sh
cut -d'|' -f2,4 | sort -u
```

## 2. Trimming `3978/3` down to `3978`
```sh
cut -d'/' -f1
```
…but only after you've removed the zID, or you'll cut the wrong line. Order:
```sh
cut -d'|' -f2,4 | sort -u | cut -d'|' -f2 | cut -d'/' -f1
```
Each `cut` narrows the line by one field. Build them one at a time and look at the
output — do not write all four in one go.

## 3. The output columns are REVERSED
`uniq -c` gives `COUNT VALUE`. The question wants `VALUE COUNT`. You must swap them:
```sh
sed -E 's/^ *([0-9]+) (.*)$/\2 \1/'
```
Two capture groups, replayed in the other order. Same idea as `Last, First` →
`First Last`.

Note this **also** eats the padding, because `^ *` is outside group 1. One stage does
both jobs — look for that whenever you're stripping and rearranging.

If `awk` is permitted, `awk '{print $2, $1}'` is shorter and handles the padding for
free. Check the question's rules first.

## 4. Sorting AFTER the swap
Once swapped, the count is field **2**:
```sh
sort -k2,2rn -k1,1
```
count descending, program ascending. If you sort *before* the swap the keys are the
other way round (`-k1,1rn -k2,2`). Both work — just be sure which line shape you're
sorting.

## Edge cases
* A student in two different programs would count in both. (Doesn't happen here; real
  data can.)
* `3978/1` and `3978/3` are the same program, different years — the `/` cut merges
  them. That's the point of the question.
* Ties on count: `more_enrollments.txt` has none, `enrollments.txt` has none either —
  but write the tie-break anyway. An autotest you can't see may have one.
