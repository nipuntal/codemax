# Module 07 &nbsp;·&nbsp; SQL

## Squashing many rows into one number


## LEARN FIRST

So far every query gave one output row per input row. An **aggregate** collapses
a whole column down to a single value.

```
      capacity                                  max(capacity)
      ┌────────┐
      │   30   │  ─┐
      │  400   │   ├──  max  ──▶                    ┌─────┐
      │   20   │   │                                │ 400 │
      │  185   │  ─┘                                └─────┘
      └────────┘
      128 rows                                      1 row
```

The five you need:

```sql
select count(*) from Rooms;          -- 128   how many rows
select max(capacity) from Rooms;     -- 400   the largest
select min(capacity) from Rooms;     -- 20    the smallest
select sum(capacity) from Rooms;     -- the total
select avg(capacity) from Rooms;     -- the average
```

You can ask for several at once — they all come back in one row:

```sql
select count(*), min(capacity), max(capacity) from Rooms;
```

### `count(*)` versus `count(column)`

These are different, and the difference is examinable.

- **`count(*)`** counts **rows**.
- **`count(column)`** counts rows where that column **is not null**.

In our tidy database they usually agree. But recall module 05: nulls appear in
*results* even when they are not in tables. Knowing which one you want, and why,
is what stops you being caught out.

Every aggregate except `count(*)` **ignores nulls**. `avg(x)` averages only the
rows where `x` has a value; it does not treat a null as zero.

### `count(distinct ...)`

```sql
select count(course) from Classes;             -- 514  (one per class)
select count(distinct course) from Classes;    -- 83   (one per course)
```

Module 06 introduced `distinct`; this is the same idea inside a count.

### Aggregates give exactly one row — which causes an error

```sql
select name, count(*) from Rooms;
```

```
ERROR:  column "rooms.name" must appear in the GROUP BY clause
        or be used in an aggregate function
```

That is not an arbitrary rule. `count(*)` squashes 128 rows into one. Which of
the 128 names should sit beside it? There is no sensible answer, so PostgreSQL
refuses rather than guessing.

For now: **a query that uses an aggregate can only select aggregates.**

### Rounding an average

`avg` gives a lot of decimal places:

```sql
select avg(capacity) from Rooms;                    -- 50.0000000000000000
select round(avg(capacity), 1) from Rooms;          -- 50.0
select avg(capacity)::numeric(6,1) from Rooms;      -- 50.0
```

Both work. `round(x, n)` is the one to reach for.

And remember module 02's trap: if you divide inside an aggregate, make sure one
side is a decimal.

```sql
select avg(end_time - start_time) from Classes;      -- fine, avg gives a decimal
select sum(end_time - start_time) / count(*) from Classes;    -- whole-number division!
select sum(end_time - start_time) / count(*)::numeric from Classes;  -- fixed
```

---

## THE TASK

One row of overall facts about the rooms.

**View** `q07(nrooms, ntypes, smallest, biggest, total_seats, avg_seats)`:

| column | meaning |
|---|---|
| `nrooms` | how many rooms there are |
| `ntypes` | how many **different** room types are in use |
| `smallest` | the smallest capacity |
| `biggest` | the largest capacity |
| `total_seats` | all the capacities added up |
| `avg_seats` | the average capacity, to **one** decimal place |

## Hints

<details><summary>Hint 1</summary>

Every column is an aggregate, so there is exactly one row and no error about
`group by`.
</details>

<details><summary>Hint 2</summary>

`ntypes` needs `distinct` inside the count.
</details>

<details><summary>Hint 3</summary>

`round(avg(capacity), 1)` for the last one.
</details>
