# Question 36 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★★★

## Course health check


A one-screen report on a course, pulling together several of the checks from
earlier questions.

```
$ ./q36.py COMP1917
COMP1917
  classes:    47 across 5 days in 20 rooms
  students:   1228 enrolled, 1.4 classes each on average
  fullest:    COMP1917 Tute-Lab Tue 15-16 in QUAD-G027 at 96.4%
  wrong room: 30 lab classes not in a Computer Lab
  clashes:    159 of 1228 students have a timetable clash
```

Rules, exactly — each label is left-aligned in **width 12** after two spaces:

- line 1: the course code
- `classes:` — `N across D days in R rooms` (distinct days, distinct rooms)
- `students:` — `N enrolled, X classes each on average` (one decimal place;
  N is **distinct** students)
- `fullest:` — `COURSE CTYPE DAY S-E in ROOM at P%` for the class with the
  highest enrolment-to-capacity ratio (earliest day/start wins a tie), one
  decimal place
- `wrong room:` — `N lab classes not in a Computer Lab` (counting `Lab Class`
  and `Tute-Lab` together)
- `clashes:` — `M of N students have a timetable clash`
- unknown course → `No such course` and nothing else
- wrong argument count → `USAGE`

> A multi-part report. Everything here you have already done once; the work is
> assembling it and getting the layout exact.

<details><summary>Hint</summary>

Five queries is fine and clearer than one heroic one. Get each line working
before starting the next.
</details>
