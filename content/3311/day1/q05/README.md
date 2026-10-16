# Module 05 &nbsp;·&nbsp; SQL

## Boxes that are empty


## LEARN FIRST

Sometimes a box in the grid has nothing in it. SQL calls that **`null`**, and it
behaves unlike every other value.

Our `classes` database is unusually tidy — every column of every row is filled
in. But you still have to understand `null`, because:

- the moment you start combining tables, `null`s appear in results even though
  they are not in the tables
- exam questions are written to catch people who assume there aren't any

### The rule that catches everyone

```sql
select * from Students where d_o_birth = null;      -- returns NOTHING. ever.
```

`null` means *unknown*. Is an unknown value equal to another unknown value?
Nobody can say — so the answer is neither true nor false, but **unknown**. And
`where` keeps only rows where the condition comes out **true**.

The correct way to ask:

```sql
select * from Students where d_o_birth is null;
select * from Students where d_o_birth is not null;
```

**`is null` / `is not null`. Never `= null`.** The failure is silent: no error,
just an empty answer, which is the hardest kind of bug to spot.

### Unknown spreads

```sql
select 5 + null;            -- null
select 'abc' || null;       -- null
select null = null;         -- null   (not true!)
select null <> null;        -- null   (not false!)
```

Anything combined with an unknown is unknown. So if one piece of a `||` chain is
null, **the whole string becomes null** — not "the other pieces".

### Supplying a stand-in with `coalesce`

```sql
select coalesce(capacity, 0) from Rooms;
```

`coalesce(a, b)` gives you `a`, unless `a` is null, in which case it gives `b`.
You can pass more arguments — it returns the first one that isn't null.

One catch: all the arguments must be the same kind of thing.

```sql
select coalesce(capacity, 'unknown') from Rooms;          -- ERROR: number vs text
select coalesce(capacity::text, 'unknown') from Rooms;    -- fine
```

Convert first (module 02's `::`), then supply the default.

### `null` and `check` constraints

Module 00 mentioned that the schema has `check` constraints like
`capacity > 0`. Worth knowing: a check **does not reject a null**. `null > 0` is
unknown, not false, and a check only blocks a row when it comes out false.

That is why the schema writes `capacity integer not null check (capacity > 0)` —
`not null` and the check are two separate promises.

> **Theory pointer.** Theory module 09 makes a further point worth carrying: a
> `null` is **ambiguous**. It might mean "we don't know", "doesn't apply", or
> "not supplied yet", and the database cannot tell you which. That ambiguity is
> a known weakness of the relational model, and it is why careful schemas — like
> this one — avoid nulls where they can.

---

## THE TASK

Show that you can build text safely even when a piece might be missing.

**View** `q05(room, label)` over `Rooms`, where `label` is:

```
NAME (TYPE, seats N)
```

— but built using `coalesce` on **every** piece, so that a missing name, type or
capacity would produce the words `unknown`, `unknown` and `0` respectively
rather than wiping out the whole label.

For example: `MECH-G15 (Computer Lab, seats 30)`.

No sorting needed yet.

## Hints

<details><summary>Hint 1</summary>

Three `coalesce`s glued together with `||` and some literal text.
</details>

<details><summary>Hint 2</summary>

`rtype` is an enumerated type, not text, so it needs `::text` before `coalesce`
can pair it with the word `'unknown'`. Same for `capacity`, which is a number.
</details>

<details><summary>Hint 3</summary>

```sql
coalesce(name, 'unknown') || ' (' || coalesce(rtype::text, 'unknown')
  || ', seats ' || coalesce(capacity::text, '0') || ')'
```
</details>
