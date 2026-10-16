# Question 33

The hardest PLpgSQL in the set. It is three ideas you already have, stacked.

### 1. "Classes involved in a clash"

```sql
where a.student_id = _student
  and exists (select 1 ... where c2.id <> c.id and <same day> and <overlap>)
```

Not *pairs* this time — the **individual classes** that participate in at least
one clash. So it's `exists`, not a self-join producing pairs, and `c2.id <> c.id`
rather than `<`, because we want each class listed if it clashes with anything.

Note that a clashing pair yields **two** report entries, one per class. That is
what the spec asks for: each is separately movable.

### 2. "An alternative that fits"

```sql
where c.course = k.course and c.ctype = k.ctype and c.id <> k.id
  and not exists (... c3.id <> k.id ... <overlap with alt> ...)
```

The subtle part is **`c3.id <> k.id`**. When testing whether an alternative
fits, you must ignore the class being moved — otherwise the alternative gets
compared against the very slot you are vacating, and a perfectly good swap looks
like a clash.

That one condition is the difference between a working answer and one that
almost always prints `no alternative offering`.

### 3. Two nested loops, two counters

```
n     -- how many clashing classes    -> decides 'No clashes'
nalt  -- alternatives for THIS class  -> decides 'no alternative offering'
```

`nalt` is reset **inside** the outer loop, once per clashing class. Declaring it
outside and forgetting to reset is the classic bug — the second class then
inherits the first's count and its "no alternative" line never prints.

### Why a loop and not `return query`

The output is **two-level**: a heading line followed by its own indented
sub-lines, with a fallback when a sub-list is empty. That structure cannot come
from one query, and the counters have to live across it. This is the situation
where PLpgSQL's procedural side genuinely earns its keep.

### If you were running out of time in an exam

Emit the clashing-class lines and always print `  -> no alternative offering`.
The `No such student` / `No clashes` branches plus the outer loop is most of the
marks; the inner search is the last slice. **A partial answer that runs beats a
complete one that doesn't.**
