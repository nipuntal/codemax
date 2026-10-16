# Day 3 · Q5 — Surnames of Male Students  ·  [shell pipeline]  ·  ⭐⭐⭐ · 12 min · **9 marks**

> **This is Question 2 of the COMP2041 practice exam, verbatim.**

We have student enrolment data in this familiar format:
```
COMP1511|3360379|Costner, Kevin Augustus          |3978/1|M
COMP3411|3863711|Klum, Heidi June Anne            |3978/3|F
```
Each line contains five fields:

1. UNSW Course Code
2. Student ID Number
3. Student Name (surname(s), given-name(s))
4. Student Plan
5. Student Gender

Each field is separated from the next by a pipe character (`|`).

In `q05.sh`, write a shell pipeline that, given student enrolment data on **stdin** in
the above format, will output the **surnames (family names) of male students**.

* Each surname should be printed only once.
* The surnames should be printed in alphabetical order.
* The input is unordered.
* The last field contains `M` if a student identifies as male.
* A comma separates the surname(s) from the given-name(s).

```
./q05.sh < enrollments.txt
Carey
Costner
Neeson
Thorpe
Wang
```
```
./q05.sh < more_enrollments.txt
Bai
Bian
Cai
...
Zeng
```
(25 surnames.)

* You may assume the data always has 5 fields.
* Your answer must be a **single shell pipeline** reading stdin.
* You may use the standard UNIX filters: `cut`, `grep`, `head`, `sed`, `sort`, `tail`,
  `uniq`, `wc`, etc.
* You may not use `if`, `while`, `for`, or other shell syntax.
* You may not use `&&`, `||`, `;`, or other shell syntax.
* You may not use Perl, C, Python, or any other language. You may not use `awk`.
* You may not create temporary files.

```sh
./test.sh          # then read WALKTHROUGH.md
```
