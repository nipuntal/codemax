# Question 31 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★★☆

## Can this student add this class?


Enrolment help desk: could this student be added to this class?

```
$ ./q31.py 5345682 152992
Kai Heyward -> COMP1000 Lab Class, Fri 9-11 in MECH-G15
- room MECH-G15 holds 30, currently 30 enrolled: FULL
- no clash with the student's timetable
Cannot add
```

Rules, in order:

- unknown student id → `No such student: ID`
- unknown class id → `No such class: ID`
- already enrolled → line 1, then `- already enrolled` and `Cannot add`
- otherwise print line 1 as
  `NAME -> COURSE CTYPE, DAY S-E in ROOM`, then
  - `- room ROOM holds C, currently N enrolled: FULL` when `N >= C`,
    otherwise `- room ROOM holds C, currently N enrolled: room available`
  - `- clashes with COURSE CTYPE DAY S-E` for **each** clashing class the
    student already has, or `- no clash with the student's timetable`
  - a final verdict: `Can add` only if the room is not full **and** there are no
    clashes; otherwise `Cannot add`
- non-numeric or wrong-count arguments → `USAGE`

> Several checks, each with its own message, and a verdict computed from them.
> This is the workload of a full exam question.

<details><summary>Hint</summary>

Four queries: the student, the class (with room), the enrolment count and the
already-enrolled test, then the clashes. Collect the facts, *then* decide.
</details>
