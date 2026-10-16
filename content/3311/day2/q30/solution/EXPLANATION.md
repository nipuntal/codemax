# Question 30

```sql
select c.course,
       count(*),
       count(*) filter (where m.rtype = 'Computer Lab'),
       count(*) filter (where m.rtype = 'Tutorial Room'),
       count(*) filter (where m.rtype not in ('Computer Lab','Tutorial Room'))
from   Classes c join Rooms m on c.held_in = m.id
where  c.ctype = 'Tute-Lab'
group  by c.course
having count(*) >= 3
order  by count(*) desc, c.course
```

### Several counts of one group

`filter` restricts an aggregate to the rows matching a condition, without a
second pass or a second query. Four counts, one scan.

The portable spelling — worth knowing, since `filter` is relatively recent — is:

```sql
count(case when m.rtype = 'Computer Lab' then 1 end)
```

A `case` with no `else` yields null for the non-matching rows, and `count`
skips nulls. Identical result.

### The self-check

The three sub-counts must sum to `ntutelabs`, because the three conditions
partition the rows. If they don't, you have overlapping or missing conditions —
which is exactly why the third is written as `not in (...)` rather than listing
the remaining types by hand. List them by hand and a room type added later
silently disappears from all three columns.

**Build the "everything else" bucket as a negation, not an enumeration.**

### `where` and `having` doing different jobs

- `where c.ctype = 'Tute-Lab'` — a property of each individual class, so it
  filters **rows**, before grouping
- `having count(*) >= 3` — a property of the whole course, so it filters
  **groups**, after

Getting this the wrong way round is the most common structural error in
group-by questions, and the error message (`aggregate functions are not allowed
in WHERE`) only catches one direction.

### What the data says

Read the output. The schema's word **"generally"** turns out to be carrying a
lot of weight: plenty of Tute-Labs are in tutorial rooms, which is arguably fine
for the tutorial half and not for the lab half. A schema comment is a claim
about intent, not a constraint — nothing in the DDL enforces any of it.

That gap between *stated intent* and *enforceable constraint* is exactly what
the theory paper's questions on assertions and triggers are about.
