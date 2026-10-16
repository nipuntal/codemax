# Module 04 &nbsp;·&nbsp; SQL

## Matching text


## LEARN FIRST

Module 03 filtered on numbers and on exact enum values. Text needs a bit more.

### Exact text

```sql
select * from Rooms where name = 'MECH-G15';
```

**Single quotes for text values.** Double quotes mean something different (they
quote *column names*), so `"MECH-G15"` is an error. If you have come from
Python, this is the main thing to unlearn.

An apostrophe inside text is written by doubling it:

```sql
select 'it''s';      -- it's
```

### Matching part of the text

Four tools, and they genuinely differ.

| | pattern style | capital letters |
|---|---|---|
| `like` | SQL patterns | must match |
| `ilike` | SQL patterns | ignored |
| `~` | regular expressions | must match |
| `~*` | regular expressions | ignored |

**SQL patterns** have exactly two special characters:

- `%` — any run of characters, including none
- `_` — exactly one character

```sql
select name from Rooms where name like 'EE-%';      -- starts with EE-
select name from Rooms where name like '%G15';      -- ends with G15
select name from Rooms where name like '%LAB%';     -- contains LAB
select name from Rooms where name ilike '%lab%';    -- contains lab, any case
```

**Regular expressions** are the fuller language — `^ $ . * + [ ] |` and so on:

```sql
select name from Rooms where name ~ '^EE-';         -- starts with EE-
select name from Rooms where name ~ 'G[0-9]+$';     -- ends with G and digits
select name from Rooms where name ~* '(mech|quad)'; -- contains either, any case
```

### The difference that catches people

`like` matches the **whole** value; `~` matches **anywhere inside** it.

```sql
select 'MECH-G15' like 'MECH';      -- f   -- 'like' wants the whole thing
select 'MECH-G15' like 'MECH%';     -- t
select 'MECH-G15' ~ 'MECH';         -- t   -- '~' looks anywhere
select 'MECH-G15' ~ '^MECH';        -- t   -- ^ pins it to the start
```

So with `like` you add `%`; with `~` you add `^` and `$` if you want to pin it
down. Mixing these two up is the most common text-matching mistake in this
course.

### Useful things you can do to text

```sql
select upper('abc'), lower('ABC');         -- ABC, abc
select length('MECH-G15');                 -- 8
select substr('MECH-G15', 1, 4);           -- MECH
select substr('MECH-G15', 6);              -- G15
select trim('  padded  ');                 -- padded
select split_part('MECH-G15', '-', 1);     -- MECH
select split_part('MECH-G15', '-', 2);     -- G15
```

`split_part(text, separator, n)` gives you the n-th piece. Our room names are
mostly `BUILDING-ROOM`, so this pulls the building out — though watch out, three
rooms have no dash at all, and `split_part` then returns the whole name.

---

## THE TASK

The Electrical Engineering building's rooms are the ones whose name begins with
`EE-`.

**View** `q04(room, rtype, capacity)` listing them.

No sorting needed yet.

## Hints

<details><summary>Hint 1</summary>

"Begins with" — either an SQL pattern with `%` on the right only, or a regular
expression anchored with `^`.
</details>

<details><summary>Hint 2</summary>

`name like 'EE-%'` or `name ~ '^EE-'`. Both are correct.
</details>

<details><summary>Hint 3</summary>

Careful: `name like '%EE-%'` would also match a room called `CHEE-1`, because
`%` on the left allows anything before it. "Begins with" means no `%` on the
left.
</details>
