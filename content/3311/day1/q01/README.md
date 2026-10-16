# Module 01 &nbsp;·&nbsp; SQL

## Getting rows out of one table


## LEARN FIRST

### The two words you need

```sql
select name from Rooms;
```

- **`from`** says *which table*.
- **`select`** says *which columns of it you want*.

The result is a new grid, made of just those columns:

```
     Rooms  (the table)                   the result
 ┌──────┬───────────┬──────────┐        ┌───────────┐
 │  id  │   name    │ capacity │        │   name    │
 ├──────┼───────────┼──────────┤   ->   ├───────────┤
 │ 1003 │ MECH-G15  │    30    │        │ MECH-G15  │
 │  209 │GOLDST-G02 │    20    │        │GOLDST-G02 │
 └──────┴───────────┴──────────┘        └───────────┘
```

**Ask for several columns**, comma-separated. The order you name them is the
order you get them:

```sql
select name, capacity from Rooms;
select capacity, name from Rooms;     -- same data, columns swapped
```

**Ask for all of them** with `*`:

```sql
select * from Rooms;
```

### The semicolon

`;` ends the statement. If you forget it, psql shows `classes-#` and waits.
It isn't stuck — type `;` and press enter.

### Capitals don't matter

`SELECT`, `select` and `SeLeCt` are the same. So are table and column names:
`rooms`, `Rooms` and `ROOMS` all work. This course writes keywords in lower
case and table names capitalised, which is just a habit that makes queries
easier to read.

### `limit` for peeking

A table with 7,784 rows will scroll off your screen. While you are exploring:

```sql
select * from Students limit 5;
```

**Only for looking around.** Don't put `limit` in an answer unless a question
asks for a specific number of rows — it silently throws data away.

---

## THE TASK

List every facility in the database.

**View** `q01(facility)` — one column, holding the facility's name.

There are 16 of them, and the check will compare them in whatever order the
table gives, so you do not need to sort anything yet.

```
$ ./check
test 01: PASSED
```

## Hints

<details><summary>Hint 1</summary>

One column, one table, no conditions. `Facilities` has columns `id` and `name`.
</details>

<details><summary>Hint 2</summary>

`select name from Facilities` — then put it inside the view wrapper that module
00 section 9 described.
</details>
