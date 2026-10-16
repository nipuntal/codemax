# Day 2 · Shell Q5 — Printing Student Middle Names

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 10 min · Format: **single pipeline**

Student enrolment data, same format, input unordered:
```
COMP1917|3360379|Costner, Kevin Augustus          |3978/1|M
```
The name field is `Surname, Given...` where the given names are the first name
followed by zero or more middle names.

Write a shell pipeline in `q05.sh` that outputs the **first middle name** of every
student who has one.

* One per line.
* Each **student** contributes at most once, no matter how many courses they take.
* If three different students share a middle name, it is printed three times.
* Students with no middle name print nothing.
* Sorted order.

```
./q05.sh < enrollments.txt
Augustus
Augustus
Fredrick
June
Nell
```

```
./q05.sh < more_enrollments.txt | head -5
Anne
Anne
Anne
Anne
Anne
./q05.sh < more_enrollments.txt | wc -l
      53
```

### Rules
* Single shell pipeline, input on stdin.
* No `if`, `while`, `for` or other shell constructs.
* POSIX shell. Any UNIX filter from lectures.
* No Perl/C/Python.

Read `NOTES.md`.

```sh
./test.sh
```
