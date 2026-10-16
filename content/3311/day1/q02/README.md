# Module 02 &nbsp;·&nbsp; SQL

## Making new columns out of old ones


## LEARN FIRST

In module 01, `select` picked columns that already existed. It can also
**compute** new ones.

### Arithmetic

```sql
select capacity, capacity * 2 from Rooms;
```

You get the capacity, and twice the capacity. The second column has an
unhelpful auto-generated name, which brings us to:

### Naming a column with `as`

```sql
select name, capacity * 2 as double_capacity from Rooms;
```

`as` names a column **in the output only**. The table itself is untouched.

You can leave the word `as` out, but don't — `capacity * 2 double_capacity`
reads like a missing comma.

### Gluing text together with `||`

Two vertical bars join pieces of text end to end:

```sql
select name || ' seats ' || capacity from Rooms;
```

→ `MECH-G15 seats 30`

Note it happily mixes text and numbers — PostgreSQL turns the number into text
for you. `||` means *join*, not "or".

### When you need to be explicit about a type

Occasionally PostgreSQL refuses to mix two things. You then say what you want
with `::`, which reads as *"treat this as a…"*:

```sql
select capacity::text from Rooms;      -- the number, as text
select '30'::integer + 1;              -- 31
```

### The whole-number division trap

```sql
select 7 / 2;        -- 3    NOT 3.5
```

Divide a whole number by a whole number and PostgreSQL gives you a whole
number, throwing the remainder away. To get a decimal, make one side a decimal:

```sql
select 7 / 2.0;      -- 3.5
select 7::numeric / 2;  -- 3.5
```

This will bite you the first time you compute an average of anything. Remember
`/ 2.0`, not `/ 2`.

### Controlling how a number prints

```sql
select 7 / 3.0;                  -- 2.3333333333333333
select round(7 / 3.0, 1);        -- 2.3
select round(7 / 3.0);           -- 2
```

`round(x, n)` keeps `n` digits after the point. This matters more than it looks:
a question that asks for a value "to one decimal place" is checking the exact
characters you print.

### Testing an expression with no table

```sql
select 7 / 2, 7 / 2.0, round(7 / 3.0, 1);
```

No `from` needed. Quickest way to find out what something does.

---

## THE TASK

Every class has a start hour and an end hour, both whole numbers.

**View** `q02(course, day, span, hours)` over `Classes`:

| column | contents |
|---|---|
| `course` | the course code |
| `day` | the day of the week |
| `span` | text like `9-11` — the start hour, a dash, the end hour |
| `hours` | how many hours long the class is |

You do not need to sort or filter — all 514 classes, in whatever order the table
gives them.

## Hints

<details><summary>Hint 1</summary>

`span` is three pieces glued with `||`: the start, the text `'-'`, and the end.
</details>

<details><summary>Hint 2</summary>

`hours` is a subtraction. Both times are whole numbers, so the answer is a whole
number — no division involved, so the trap above doesn't apply here.
</details>

<details><summary>Hint 3</summary>

`start_time || '-' || end_time` and `end_time - start_time`.
</details>
