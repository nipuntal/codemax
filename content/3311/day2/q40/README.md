# Question 40 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★★★

## CAPSTONE — find this class a better room


> The hardest question in the set. It uses ideas from questions 12, 18, 24, 29,
> 31 and 35 at once.

A class is in the wrong sort of room, or too small a one. Find it a better home.

```
$ ./q40.py 152992
COMP1000 Lab Class, Fri 9-11, currently MECH-G15 (Computer Lab, 30) with 30 students
Wanted: Computer Lab, capacity >= 30
Candidates:
  EE-130               Computer Lab      30  free
  ...
```

### Rules

One argument: a class id.

- non-numeric argument or wrong count → `USAGE`
- unknown class → `No such class: ID`
- line 1: `COURSE CTYPE, DAY S-E, currently ROOM (TYPE, CAP) with N students`
- line 2: `Wanted: WANTEDTYPE, capacity >= N` where `WANTEDTYPE` is the
  appropriate room type for the class type:

  | class type | wanted room type |
  |---|---|
  | Lecture | Lecture Theatre |
  | Tutorial | Tutorial Room |
  | Lab Class | Computer Lab |
  | Tute-Lab | Computer Lab |
  | Seminar | Meeting Room |

- line 3: `Candidates:`
- then up to **five** candidate rooms: of the wanted type, capacity at least the
  class's enrolment, **excluding the room it is already in**, each shown as
  name left-aligned width 20, one space, type left-aligned width 17, one space,
  capacity right-aligned width 3, two spaces, then `free` if nothing else is in
  that room at that time on that day, or `busy` if something is
- order candidates: `free` before `busy`, then smallest sufficient capacity
  first, then by name
- if there are no candidates at all → `  none available` instead
- finally: `Already correctly roomed` if the current room is already of the
  wanted type **and** big enough, otherwise `Needs moving`

<details><summary>How to attack it</summary>

1. Fetch the class with its room and enrolment count.
2. Map class type to wanted room type with a Python dict.
3. One query for candidates, with the free/busy flag as a `not exists`
   sub-select in the select list.
4. Order in SQL: `free` first is `order by (busy) asc` — think about how to
   express that.
5. The verdict is two comparisons on data you already have.
</details>
