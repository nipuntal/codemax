# Module 03 &nbsp;·&nbsp; SQL

## Choosing which rows you want


## LEARN FIRST

`select` chooses **columns**. `where` chooses **rows**.

```sql
select name, capacity from Rooms where capacity > 200;
```

Read it as: *go through `Rooms` one row at a time; keep the rows where the
condition is true; then show those two columns.*

```
 ┌──────┬───────────┬──────────┐
 │ 1003 │ MECH-G15  │    30    │  capacity > 200 ?  no  -> dropped
 │  760 │ CLB-7     │   400    │  capacity > 200 ?  YES -> kept
 │  208 │GOLDST-G01 │    20    │  capacity > 200 ?  no  -> dropped
 └──────┴───────────┴──────────┘
```

### The order things happen

You **write** `select … from … where …`, but the database **does**
`from` → `where` → `select`. That is why you can filter on a column you never
display:

```sql
select name from Rooms where capacity > 200;      -- perfectly fine
```

### Comparisons

| you write | it means |
|---|---|
| `=` | equal — **one** equals sign |
| `<>` or `!=` | not equal |
| `<` `>` `<=` `>=` | the usual |
| `between a and b` | at least a and at most b — **includes both ends** |
| `in (1,2,3)` | equal to any one of these |

```sql
select name from Rooms where capacity between 100 and 200;
select * from Classes where start_time in (9, 10, 11);
select * from Classes where start_time not in (9, 10, 11);
```

`in` is much nicer than three `or`s.

### Joining conditions together

`and`, `or`, `not`. **`and` binds more tightly than `or`**, exactly like × binds
more tightly than + in arithmetic.

```sql
-- these two mean DIFFERENT things
where capacity > 200 and start_time = 9 or start_time = 10
where capacity > 200 and (start_time = 9 or start_time = 10)
```

The first is `(capacity > 200 and start_time = 9) or (start_time = 10)`.

**When you mix `and` with `or`, put brackets.** Always. It costs nothing and
removes a whole family of silently-wrong answers.

### English into conditions

Questions are written carefully, so read them carefully:

| the words | the condition |
|---|---|
| more than 10 | `> 10` |
| at least 10 / 10 or more | `>= 10` |
| under 10 / fewer than 10 | `< 10` |
| between 5 and 10 | `between 5 and 10` — **includes** 5 and 10 |

### Trying a condition on its own

```sql
select 5 between 5 and 12;      -- t
select 3 in (1,2,3);            -- t
```

`t` and `f` are how PostgreSQL prints true and false.

---

## THE TASK

Find the **big morning lectures**: classes that are of type `Lecture`, start at
or before 12, and run for **more than one hour**.

**View** `q03(course, day, start_time, end_time)`.

No sorting needed yet.

## Hints

<details><summary>Hint 1</summary>

Three conditions joined with `and`. No `or` anywhere, so no brackets needed.
</details>

<details><summary>Hint 2</summary>

"Of type Lecture" is `ctype = 'Lecture'` — single quotes, and the spelling must
match exactly (a wrong spelling gives a loud error, as module 00 section 6
mentioned).
</details>

<details><summary>Hint 3</summary>

"Runs for more than one hour" is a condition on two columns at once:
`end_time - start_time > 1`.
</details>
