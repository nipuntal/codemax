# Module 15 &nbsp;·&nbsp; SQL

## Stacking two results together


## LEARN FIRST

Three operators take the results of **two queries** and combine them.

```sql
(select held_in from Classes where ctype = 'Lecture')
union
(select held_in from Classes where ctype = 'Tutorial');
```

| operator | keeps |
|---|---|
| `union` | rows in **either** result |
| `intersect` | rows in **both** |
| `except` | rows in the **first but not the second** |

Picture two piles of rows:

```
     A            B            A union B      A intersect B      A except B
  ┌─────┐      ┌─────┐         ┌─────┐          ┌─────┐           ┌─────┐
  │ 209 │      │ 209 │         │ 209 │          │ 209 │           │1003 │
  │1003 │      │ 347 │         │1003 │          └─────┘           └─────┘
  └─────┘      └─────┘         │ 347 │
                               └─────┘
```

### The rules

1. Both sides must have the **same number of columns**, of compatible types.
2. The output column names come from the **first** query.
3. All three **remove duplicates** automatically.
4. `order by` goes **once, at the very end**, and applies to the whole thing.

```sql
(select name from Rooms where rtype = 'Computer Lab')
union
(select name from Rooms where capacity > 300)
order by name;
```

Putting an `order by` inside one branch is either an error or meaningless — it
goes at the bottom.

### Keeping the duplicates

`union all` skips the duplicate-removal. It is faster, and occasionally it is
what you want:

```sql
select count(*) from (
    (select held_in from Classes where day_of_week = 'Mon')
    union all
    (select held_in from Classes where day_of_week = 'Tue')
) t;
```

`intersect all` and `except all` exist too but are rarely useful.

### `except` is how SQL says "but not"

```sql
-- rooms used on Monday but never on Friday
(select held_in from Classes where day_of_week = 'Mon')
except
(select held_in from Classes where day_of_week = 'Fri');
```

Any question phrased *"X but not Y"*, *"X that never Y"*, *"X with no Y"* is a
candidate for `except`.

**`except` is not symmetric.** Swapping the two queries gives a different
answer, unlike `union` and `intersect`.

### `except` versus `not exists`

Module 14 gave you `not exists` for "has none". These two are often
interchangeable:

```sql
(select id from Rooms) except (select held_in from Classes);

select id from Rooms r
where not exists (select 1 from Classes c where c.held_in = r.id);
```

`except` is tidier when both sides are simple lists of the same thing.
`not exists` is better when you need **other columns** in the output — with
`except` you would have to join back to get them.

### Tagging which branch a row came from

A useful trick: select a constant alongside the real columns.

```sql
(select name, 'big'   from Rooms where capacity > 200)
union
(select name, 'small' from Rooms where capacity < 30)
order by 2, 1;
```

The literal `'big'` is just a value, the same on every row of that branch. It
lets you build a classification out of several queries.

---

## THE TASK

Classify the rooms by how they are used.

**View** `q15(room, usage)` where `usage` is exactly one of:

| word | meaning |
|---|---|
| `lectures only` | the room hosts at least one class of type `Lecture`, and no `Tutorial` |
| `tutorials only` | at least one `Tutorial`, and no `Lecture` |
| `both` | at least one of each |

Rooms hosting neither are left out.

Sorted by `usage`, then room name.

## Hints

<details><summary>Hint 1</summary>

Three queries, each producing (room name, a literal word), stacked with `union`.
</details>

<details><summary>Hint 2</summary>

Each branch tests membership twice — once with `exists` (module 14) and once
with `not exists`, or once with `in` and once with `not in`.
</details>

<details><summary>Hint 3</summary>

`order by 2, 1` sorts by the second output column then the first — handy when
the columns are computed.
</details>
