# Module 15

Three queries, one per category, stacked with `union`.

### Selecting a constant

```sql
select r.name, 'both' from Rooms r where ...
```

`'both'` is just a value — identical on every row of that branch. That is how
you tag rows with which case they fell into, and it is the standard way to build
a classification out of several queries.

### Why `exists` and not a join

A room may host forty lectures. Joining to `Classes` would produce that room
forty times and you would need `distinct` (module 11). `exists` asks only *is
there at least one?* and gives the room back once.

### Why `not exists` and not `not in`

Module 13's warning: if the inner list ever contained a null, `not in` would
return **no rows at all**, silently. `Classes.held_in` cannot be null, so both
work here — but `not exists` is immune by construction and is the habit worth
building.

### The three branches cannot overlap

Each room satisfies exactly one of the three `where` clauses, so `union` never
actually has duplicates to remove. `union all` would give the same answer
slightly faster. Either is accepted.

### `order by 2, 1`

Sorting by output column **positions** — the second column (`usage`) then the
first (`room`). With `union`, naming the columns is awkward because the names
come from the first branch, so positions are the practical choice here.

### Reading the answer

Most rooms come out `tutorials only`, which fits what module 07 showed: 99 of
the 128 rooms are tutorial rooms. The `both` group is small — those are the
rooms doing double duty.

### Worth trying

```sql
(select held_in from Classes where day_of_week='Mon')
except
(select held_in from Classes where day_of_week='Fri');

(select held_in from Classes where ctype='Lecture')
intersect
(select held_in from Classes where ctype='Lab Class');
```
