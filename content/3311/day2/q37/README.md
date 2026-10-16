# Question 37 &nbsp;·&nbsp; PLpgSQL &nbsp;·&nbsp; ★★★★★

## The room dossier


```
create or replace function q37(_room integer) returns setof text
```

A complete report on one room, in sections.

- no such room → `No such room`
- otherwise:
  1. `NAME (TYPE, capacity N)`
  2. `Facilities:` then one indented line `  - FACILITY` per facility in name
     order, or `  - none`
  3. `Usage:` then `  - N classes, H hours, busiest day DAY with M classes`
     (earliest day wins a tie; if the room has no classes, just
     `  - no classes scheduled`)
  4. `Clashes:` then one `  - DAY S1-E1 vs S2-E2` line per double-booked pair,
     or `  - none`

```
MECH-G15 (Computer Lab, capacity 30)
Facilities:
  - Workstation
Usage:
  - 23 classes, 35 hours, busiest day Tue with 7 classes
Clashes:
  - Mon 16-18 vs 16-18
  - Mon 18-19 vs 18-19
  ...
```

> The full `setof text` workload: several sections, each with its own empty
> case. If you can write this one, exam question 3 will not surprise you.

<details><summary>Hint</summary>

Four blocks, each a loop or a single query, each with its own counter for the
"none" line. Do them one at a time and load the file after each.
</details>
