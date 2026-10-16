# Question 28 &nbsp;·&nbsp; PLpgSQL &nbsp;·&nbsp; ★★★★☆

## How full is each class of a course?


```
create or replace function q28(_course text) returns setof text
```

For each class of the course, report how full its room is.

- no such course → `No such course`
- otherwise one line per class, ordered by day then start time:
  `DAY S-E CTYPE ROOM N/C (P%)`
  where `N` is the enrolment, `C` the room capacity and `P` the percentage to
  **one** decimal place
- after the class lines, a final line `Fullest: ROOM at P%` naming the room of
  the fullest class (**the earliest such class** if several tie)

```
Wed 13-15 Lecture D23-304 30/30 (100.0%)
...
Fullest: D23-304 at 100.0%
```

> **Tests:** arithmetic and rounding inside PLpgSQL, plus keeping a running
> "best so far" through a loop.

<details><summary>Hint 1</summary>

`round(n * 100.0 / cap, 1)` — the `100.0` forces decimal division.
</details>

<details><summary>Hint 2</summary>

Track the best percentage and its room in two variables as you loop, updating
only on a **strictly greater** value so the earliest tie wins.
</details>
