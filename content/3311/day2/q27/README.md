# Question 27 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★★☆

## Do these two courses collide?


Could a student take both of these courses? Report how many students already
take both, and every pair of class times that would clash between them.

```
$ ./q27.py COMP1917 COMP1927
COMP1917 and COMP1927
- 41 students take both
- Wed 13-15 COMP1917 Tute-Lab EE-417 vs Wed 13-15 COMP1927 Lecture D23-304
...
- 7 clashing pairs
```

Rules:

- line 1: `COURSE1 and COURSE2`
- then `- N students take both`
- then one line per clashing pair of classes, one from each course:
  `- DAY S1-E1 COURSE1 CTYPE1 ROOM1 vs DAY S2-E2 COURSE2 CTYPE2 ROOM2`
  ordered by day, then first start time, then second start time, then the two
  room names

  (the rooms matter: a course can run two classes in the same hour in different
  rooms, and without the room those lines would be indistinguishable)
- then `- M clashing pairs`
- if the two codes are the **same** → `Same course` and nothing else
- if either course does not exist → `No such course: CODE` (check the first
  argument first)
- wrong argument count → `USAGE`

> **Tests:** two "no such X" checks, a cross-course clash join, a count of a
> set intersection.

<details><summary>Hint 1</summary>

"Students who take both" is an intersection — `intersect` in SQL, or two sets in
Python.
</details>

<details><summary>Hint 2</summary>

The clash join has no `a.id < b.id`: the two sides come from different courses,
so they are not interchangeable.
</details>
