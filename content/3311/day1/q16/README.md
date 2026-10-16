# Module 16 &nbsp;·&nbsp; SQL

## Questions with the word "every" in them


## LEARN FIRST

Some questions say **all** or **every**:

- which courses hold **every** one of their classes in a computer lab?
- which rooms have **all** of the facilities that room X has?
- which students attend **every** class of their course?

These are the hardest ordinary SQL questions, because **SQL has no "for every"
operator**. You have to turn the question inside out.

### The trick

> "X did **all** of them" is the same as "there is **nothing** X missed."

SQL can do that second phrasing, because it has `except` (module 15) to work out
what is missing, and `not exists` (module 14) to check that a result is empty.

### The recipe

```sql
select c.course
from   Classes c
where  not exists (
           (select id from Rooms where rtype = 'Computer Lab')   -- everything required
           except
           (select held_in from Classes where course = c.course) -- what this course uses
       );
```

Read the inside first:

- `(everything required)`
- `except` `(what this one has)`
- what is left over is **what it is missing**
- `not exists (...)` — true when nothing is left, i.e. it missed nothing

The `where course = c.course` makes it correlated (module 14): it is worked out
afresh for each course.

### Getting the `except` the right way round

This is the only genuinely hard part.

```sql
(everything required) except (what they have)   -- what is MISSING   ← correct
(what they have) except (everything required)   -- what is EXTRA     ← wrong
```

You want the first. Write the second and you get **everybody**, because nobody
has anything outside the required set. **If your "for every" query returns all
the rows, you have the `except` backwards.**

### The double-negative version

```sql
select c.course from Classes c
where not exists (
    select 1 from Rooms m where m.rtype = 'Computer Lab'
    and not exists (
        select 1 from Classes c2
        where c2.course = c.course and c2.held_in = m.id
    )
);
```

*There is no computer lab that this course never uses.* Uglier, same answer.
Some people find it easier to derive; use whichever you can write correctly
under pressure.

### The counting version

```sql
select course
from   Classes
group  by course
having count(distinct held_in) = (select count(*) from Rooms where rtype='Computer Lab');
```

*Does this course use as many distinct rooms as there are computer labs?* Short
and often easiest to read — but note it only works because we already restricted
attention to the right rooms. If the course also used a lecture theatre, the
count would be wrong.

**Know at least two of the three.** Under pressure one of them will come out
right.

> **Theory pointer.** In relational algebra this operation has its own name —
> **division** — and the "no counterexample" rewrite above is the standard way
> to express it in SQL. Theory module 31 covers it. The short version: division
> answers "which X are related to *every* Y", and SQL has to fake it with a
> double negative.

---

## THE TASK

Which courses are taught **entirely in tutorial rooms** — that is, every one of
their classes is held in a room whose `rtype` is `Tutorial Room`?

**View** `q16(course, nclasses, nrooms)`:

| column | meaning |
|---|---|
| `nclasses` | how many classes the course runs |
| `nrooms` | how many **different** rooms it uses |

Only courses running **3 or more** classes. Sorted by course code.

## Hints

<details><summary>Hint 1</summary>

"Every class is in a tutorial room" is the same as "there is no class of this
course that is **not** in a tutorial room".
</details>

<details><summary>Hint 2</summary>

That phrasing needs neither `except` nor division — a plain `not exists` over
this course's own classes will do it.
</details>

<details><summary>Hint 3</summary>

`having count(*) >= 3` for the size restriction, and `count(distinct held_in)`
for `nrooms` (module 08).
</details>
