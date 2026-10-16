# Day 2 · Python Q19 — Enrolment Report

**Difficulty:** ⭐⭐⭐⭐ · **Target:** 13 min

The enrolment data from the shell questions, now in Python:
```
COMP1917|3360379|Costner, Kevin Augustus          |3978/1|M
COURSE  |  ZID  | Surname, Given names            |PROG/YR|SEX
```
The name field is padded with trailing spaces. Input is unordered.

Write a Python program `q19.py` that reads this data on **stdin** and prints:

```
students: N
courses: N
Enrolments per course:
  COURSE N
  ...
Students in most courses:
  ZID NAME (N courses)
  ...
Shared first names:
  NAME: ZID, ZID
  ...
```

* `students` / `courses` are counts of distinct values.
* **Enrolments per course** — every course, ordered by count descending then course
  code ascending, indented two spaces.
* **Students in most courses** — the top 3 students by number of courses, most first,
  ties by zID ascending. NAME is `First Last` (first given name and surname only).
  Indented two spaces.
* **Shared first names** — every first name held by more than one *distinct student*,
  in alphabetical order, with their zIDs ascending, comma-space separated. Indented two
  spaces.

```
./q19.py < enrollments.txt
students: 10
courses: 10
Enrolments per course:
  COMP3311 3
  COMP3331 3
  COMP1917 2
  COMP2041 2
  COMP1927 1
  COMP2920 1
  COMP3141 1
  COMP3411 1
  COMP3891 1
  COMP4920 1
Students in most courses:
  3383025 Ian Thorpe (3 courses)
  3360582 Liam Neeson (2 courses)
  3860448 Mary Steenburgen (2 courses)
Shared first names:
  Ian: 3371161, 3383025
  Mary: 3364562, 3711611, 3860448
  Wei: 5122456, 5456732
```

* Your answer must be Python only. You may not run external programs.

Read `NOTES.md`.

```sh
./test.sh
```
