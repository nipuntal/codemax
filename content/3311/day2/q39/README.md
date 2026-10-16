# Question 39 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★★★

## EXAM SIMULATION — question 5


> **Treat this as the real thing.** Around 9 marks, 30 minutes.

Which of a course's students have clashes, and on which day? Group the report
**by day of the week**, listing every weekday whether or not it has anything.

```
$ ./q39.py COMP1927
COMP1927: 21 of 216 students have a clash
Mon
- no clashes on this day
Tue
- Kristy Zhang (5347594): COMP1927 Lab Class 16-18 vs COMP9024 Lecture 16-18
...
```

### Rules

- unknown course → `No such course`
- line 1: `COURSE: M of N students have a clash`, where `N` is the distinct
  students enrolled in the course and `M` is how many of them have a clash
  **that involves at least one class of this course**
- then, for each of `Mon Tue Wed Thu Fri` in order: the day name, then either
  - one line per clash, `- NAME (ID): COURSE CTYPE S1-E1 vs COURSE2 CTYPE2 S2-E2`
    where the **first** class named is the one belonging to this course
  - or `- no clashes on this day`
- within a day, order by student name, then id, then first start time
- list each clashing pair **once** per student
- wrong argument count → `USAGE`

<details><summary>How to attack it</summary>

1. Existence check on the course.
2. Distinct students enrolled — you need `N` anyway.
3. One query for the clashes: join `Attends` to itself for the same student,
   where the **first** class is in this course and the second is any other class
   they attend, on the same day, overlapping.
4. `M` is the distinct students in that result — count it in Python from the
   rows you already have.
5. Group the rows by day in Python and print the fixed day list.
</details>

<details><summary>Watch out</summary>

If **both** classes belong to this course, the pair would be produced twice —
once in each order. Constrain with `a.class_id < b.class_id` **only** when both
sides are in the course… which is fiddly. Simpler: require the first class to be
in the course, and de-duplicate on the unordered pair of class ids in Python.
</details>
