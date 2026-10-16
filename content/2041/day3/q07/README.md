# Day 3 · Q7 — Most Common Given Name  ·  [shell pipeline]  ·  ⭐⭐⭐ · 12 min

Same enrolment format as Q5.

In `q07.sh`, write a shell pipeline that outputs the **most common first given name**
among **female** students.

* Print a single line containing a single word.
* Each **student** counts once, no matter how many courses they are enrolled in.
* If several names are equally most common, print the one that is alphabetically first.

```
./q07.sh < enrollments.txt
Mary
```
```
./q07.sh < more_enrollments.txt
Lien
```

* Single shell pipeline reading stdin.
* No `if`, `while`, `for`, `&&`, `||`, `;`. No `awk`. No temporary files.

```sh
./test.sh          # then read WALKTHROUGH.md
```
