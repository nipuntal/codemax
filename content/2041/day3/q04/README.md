# Day 3 · Q4 — Four grep Commands  ·  [grep]  ·  ⭐⭐⭐ · 15 min · **10 marks**

> **This is Question 1 of the COMP2041 practice exam, verbatim.**

You have been given the file `awards.psv`.
This file contains information about Nobel Prize, Turing Award and Fields Medal winners.
Each line in the file contains the following six fields:

1. Award Name
2. Award Year
3. Winner Name
4. Winner Gender
5. Winner Country
6. Winner Birth Year

Each field is separated from the next field by a pipe character (`|`).

Your task is to write four `grep` commands which will print specified lines from this
file. In `q04.txt` add answers to the four questions, in the specified locations.
Do not add, remove, or change any other text in the file.

1. **Question 1** — print the lines in `awards.psv` that contain awards won by an
   Australian.
2. **Question 2** — print the lines in `awards.psv` that contain a female ACM Turing
   Award winner.
3. **Question 3** — print the lines in `awards.psv` that contain Nobel Prizes won by a
   person born between 1990 and 1999 (inclusive).
4. **Question 4** — print the lines in `awards.psv` that contain awards won by a person
   with first name, last name, and middle initial starting with the same letter.

Example of the expected form of an answer:
```
grep -E 'Andrew' awards.psv
ACM Turing Award|2000|Andrew Chi-Chih Yao|Male|China|1946
Nobel Prize for medicine|1963|Andrew F. Huxley|Male|United Kingdom|1917
```

* Each answer must be a **single grep command only**.
* You may not use the `-P/--perl-regexp` option.
* You may use any other grep option, e.g. `-w`.
* You may quote the arguments to grep.
* You may not use any command other than `grep` — no `sed`, no `cut`.
* You cannot use pipes or I/O redirection.
* You can assume `|` only ever appears as a field separator.
* The input is unordered.

```sh
./test.sh          # then read WALKTHROUGH.md
```
