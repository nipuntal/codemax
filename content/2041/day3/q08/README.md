# Day 3 · Q8 — Enrolment Report  ·  [python]  ·  ⭐⭐⭐ · 11 min

Same enrolment format as Q5 (`COURSE|ZID|Surname, Given|PLAN|SEX`).

Write a Python program `q08.py` that reads the data on stdin and prints:

```
COURSE N student(s): NAME, NAME, ...
```
for every course, in **alphabetical order of course code**.

* `N` is the number of **distinct students** enrolled in that course.
* `NAME` is `Given Surname` (first given name and surname only), listed
  **alphabetically**, comma-space separated.

```
./q08.py < enrollments.txt
COMP1511 2 student(s): Kevin Costner, Mary Carey
COMP1521 1 student(s): Liam Neeson
COMP2041 2 student(s): Liam Neeson, Mary Steenburgen
COMP3141 1 student(s): Ian Thorpe
COMP3311 3 student(s): Ian Thorpe, Ian Thorpe, Mary Klum
COMP3331 3 student(s): Ian Thorpe, Wei Wang, Wei Wang
COMP3411 1 student(s): Heidi Klum
COMP3891 1 student(s): Heidi Klum
COMP4920 2 student(s): Mary Steenburgen, Wei Wang
```

* Python only, reading stdin. No external programs.

```sh
./test.sh          # then read WALKTHROUGH.md
```
