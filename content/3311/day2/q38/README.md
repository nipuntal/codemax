# Question 38 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★★★

## EXAM SIMULATION — question 4


> **Treat this as the real thing.** Around 8 marks, 25 minutes. Read it twice
> before typing. Everything you need is in questions 01–37.

A room's day, showing not just what is booked but the **gaps** between bookings.

```
$ ./q38.py MECH-G15 Tue
MECH-G15 Tue
09-13 COMP1000 Lab Class
13-15 COMP3441 Lab Class
15-16 FREE (1 hours)
...
Booked 8 hours, free 4 hours between 9 and 21
```

### Rules

Two arguments: an **exact** room name and a day.

- unknown room → `No such room: NAME`
- invalid day → `No such day: DAY`
- otherwise line 1 is `NAME DAY`, then a line for every hour block from **9 to
  21**, in time order, each covering a contiguous stretch:
  - a booking: `SS-EE COURSE CTYPE` where `SS` and `EE` are **two-digit,
    zero-padded** hours
  - a gap: `SS-EE FREE (N hours)`
- if two classes overlap, treat the block as booked and show the one whose
  course code sorts first; the block runs from the earliest start to the latest
  end among the overlapping classes
- final line: `Booked H hours, free G hours between 9 and 21`
- a completely empty day is one `09-21 FREE (12 hours)` line, then the summary
- wrong argument count → `USAGE`

<details><summary>How to attack it</summary>

1. Get the room, then the day's classes ordered by start time.
2. Walk an `hour` cursor from 9 to 21. At each step, is any class covering this
   hour? Build hour-by-hour first, then merge equal neighbours into blocks —
   that is far easier than trying to compute blocks directly.
3. Merge runs: step through the 12 hours, and start a new block whenever the
   label changes.
4. Sum the booked hours as you go.
</details>
