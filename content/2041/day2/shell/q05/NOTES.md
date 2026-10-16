# Notes — the trailing-space trap, and "select only lines that have the thing"

This is the real weekly-test question shape (compare: *Printing Student First Names*).
Three things must all be right.

## 1. Dedupe on the student, sort on the name
From Q3:
```
cut -d'|' -f2,3 | sort -u | ... extract ... | sort
```
The final `sort` has **no `-u`** — two students may share a middle name and both must
print. The `sort -u` in the middle is on `zid|name`, which is unique per student.

## 2. The trailing spaces WILL bite you here
The name field is padded to a fixed width:
```
Costner, Kevin Augustus          |
                        ^^^^^^^^^^ real space characters
```
Q3 got away with ignoring them because `cut -d',' -f1` stopped before them. Here you
are extracting from the **end** of the name, so they are directly in your way.

Three ways to deal with them:
```sh
sed -E 's/ +$//'                 # strip trailing spaces first
sed -E 's/ +\|/|/'               # strip them where they meet the delimiter
```
…or write a regex that simply doesn't allow them into the capture:
```sh
sed -E 's/.*, [^ ]+ ([^ ]+).*/\1/'
```
`[^ ]+` is "a run of non-space characters", so it stops at the space before the
padding. **"Not the terminator" beats "strip it afterwards"** — one regex, no extra
stage.

## 3. Selecting only students who HAVE a middle name
A pipeline can't use `if`. The filter has to be a `grep`:
```sh
grep -E ', [^ ]+ [^ ]+'          # comma, space, word, space, word
```
Read that as "the given-names part has at least two words".

The alternative — extract with a `sed` that doesn't match, and let non-matching lines
pass through unchanged — is a **bug**, not a feature: `sed` prints lines it didn't
change, so students with no middle name would leak through as whole records.
If you catch yourself relying on that, add a `grep` instead.

## Building it
```sh
cut -d'|' -f2,3 | head          # look
cut -d'|' -f2,3 | sort -u | head
... add the grep, check the count drops
... add the sed, check one line looks right
... add the final sort
```
Check the line count at each stage. 16 → 10 → 5 tells you the dedupe and the filter
both fired.

## Edge cases in this data
* `Thorpe, Ian Augustus` (3383025) appears in **4** records → must print once.
* `Thorpe, Ian Fredrick` (3371161) is a *different* student with the same first name.
* `Klum, Heidi June Anne` has **two** middle names — print only the first (`June`).
* `Wang, Wei` ×2 (different zIDs) have no middle name at all → print nothing.
* `Carey, Mary` — single given name, no middle name.
