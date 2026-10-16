# Question 10 &nbsp;·&nbsp; PLpgSQL &nbsp;·&nbsp; ★★☆☆☆

## Timetable for a course, in PLpgSQL


The same job as question 07, but as a database function returning **lines of
text** — the shape every past-paper PLpgSQL question has used.

```
create or replace function q10(_course text) returns setof text
```

- no such course → a single line `No such course`
- otherwise one line per class: `DAY S-E CTYPE in ROOM`
  (single spaces this time), ordered by day, start time, room name

```
psql -At -c "select * from q10('COMP1927');"
Wed 13-15 Lecture in D23-304
...
```

> **Tests:** `returns setof text`, `return next`, `return query`.

<details><summary>Hint 1</summary>

`returns setof text` means each `return next <a text value>;` adds one line.
</details>

<details><summary>Hint 2</summary>

Loop with `for r in select ... loop ... return next ...; end loop;`, then check
whether you emitted anything.
</details>

<details><summary>Hint 3</summary>

Track a counter, or `perform`/`select count(*)` first, to decide whether to emit
the `No such course` line.
</details>
