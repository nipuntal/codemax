# Module 40 &nbsp;·&nbsp; Python + Psycopg2

## The last mile


## You have covered the whole stack

Modules 00–18 were SQL. 19–24 were PLpgSQL. 25–39 were Python and psycopg2.
That is everything the five practical exam questions draw on.

This module is a checklist and one last question.

---

## The checklist

### Before you write anything

- [ ] Read the question **twice**. The second read is where you notice "or 0 if
      none", "ties share a place", "in date order".
- [ ] Look at the expected output in the question and **count the spaces**.
- [ ] Open `psql` and look at the actual data. Five minutes here saves twenty
      later.

### While writing SQL

- [ ] `where` filters rows; `having` filters groups (module 09)
- [ ] `count(*)` counts rows; `count(col)` skips nulls — after a `left join` you
      almost always want the second (module 12)
- [ ] any `order by` on a column with duplicates needs a tie-breaker (module 06)
- [ ] `is null`, never `= null` (module 05)
- [ ] group by the **key**, not just the displayed name (module 12)
- [ ] "the largest X" → `where x = (select max(x) …)`, not `limit 1` — unless
      the question names a tie-breaker (modules 13, 27)
- [ ] joining one-to-many then counting the "one" side → `count(distinct …)`
      (modules 08, 11)
- [ ] "every / all" → turn it inside out with `not exists` (module 16)

### While writing PLpgSQL

- [ ] check the thing exists with `if not found` (module 20)
- [ ] an aggregate always returns a row, so test the **count**, not `found`
- [ ] after `return next 'No such X';` you need a bare `return;` (module 22)
- [ ] `elsif`, not `elseif`
- [ ] reset your counters inside the loop that uses them (module 24)

### While writing Python

- [ ] values go in through `%s`, never f-strings or `+` (module 28)
- [ ] `fetchone()` returns a **tuple**, or `None` — check before subscripting
      (module 27)
- [ ] fetch **all** matches when the spec distinguishes "none" from "several"
      (module 38)
- [ ] `db.commit()` after anything that changes data (module 34)
- [ ] guard every division whose denominator came from the data (module 37)
- [ ] the driver template stays; your code goes in `main()` (module 25)

### Before you submit

- [ ] run `./check` — "right values, wrong spacing" is still a fail
- [ ] test the empty case, the missing case and the bad-argument case
- [ ] make sure the file **runs**; a crash scores nothing
- [ ] `submit qN` — and again each time you improve it

### Time

The lecturer's own advice: **give up on a practical question at 30 minutes.**
Five practical questions plus four written ones in three hours means you cannot
afford to sink an hour into one. A half-finished question that runs and passes
two tests beats a perfect one you never reached.

---

## THE TASK

One last question, drawing on everything.

Given a **facility** name, report which rooms have it and how heavily they are
used.

```
$ ./q40.py Workstation
Workstation is in 10 rooms
MECH-G15             Computer Lab      30   23 classes   35 hours
...
totals: 10 rooms, 97 classes, 177 hours
```

### Rules

- unknown facility (exact name) → `No such facility: NAME`
- line 1: `NAME is in R rooms`
- then one line per room that has it:
  - room name left-aligned in **width 20**, a space
  - room type left-aligned in **width 15**, a space
  - capacity right-aligned in **width 4**, two spaces
  - the class count right-aligned in **width 3**, then ` classes`, two spaces
  - the total hours right-aligned in **width 3**, then ` hours`
- ordered by class count descending, then room name
- rooms with the facility but **no classes** must still appear, showing `0`
- a final line: `totals: R rooms, C classes, H hours`
- if the facility is in no rooms at all, print line 1 with `0` and then the
  totals line with zeros
- wrong argument count → `USAGE`

## Hints

<details><summary>Hint 1</summary>

`Facilities` → `Has` → `Rooms` → `Classes`, and the last of those must be a
`left join` so unused rooms survive (module 12).
</details>

<details><summary>Hint 2</summary>

`count(c.id)` and `coalesce(sum(c.end_time - c.start_time), 0)` — modules 12 and
20.
</details>

<details><summary>Hint 3</summary>

Check the facility exists separately, so you can tell "no such facility" apart
from "in no rooms" (module 30).
</details>

---

## After this

You have the whole toolkit. The natural next step is timed practice against
whole past papers — but every one of these 41 modules is a place to come back to
when something does not work.
