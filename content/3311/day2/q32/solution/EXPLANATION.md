# Question 32

```sql
select a.course, b.course, a.nclasses, b.nclasses
from   q32big a join q32big b on a.course < b.course
where  not exists (
           select 1
           from   Classes x join Classes y
                    on x.day_of_week = y.day_of_week
                   and x.start_time < y.end_time
                   and y.start_time < x.end_time
           where  x.course = a.course and y.course = b.course
       )
order  by a.course, b.course
```

### "For all" becomes "there is no counterexample"

*Every* class of A avoids *every* class of B — a doubly-universal statement, and
SQL has no `for all`. The standard move applies: **negate it once.**

> No pair (x from A, y from B) overlaps.

That is a plain `not exists` over the cross product of the two courses' classes,
filtered by the overlap condition. One negation handles both quantifiers,
because "for all x, for all y, not P" is exactly "not exists x,y such that P".

### Two correlations in one subquery

```sql
where x.course = a.course and y.course = b.course
```

The subquery reaches out to **both** `a` and `b` from the outer query. That is
unusual — most correlated subqueries reference one outer table — and it is what
makes this hard to write from scratch. Build it in stages:

1. get the clashing pairs for two *hard-coded* courses working
2. replace the literals with `a.course` and `b.course`
3. wrap in `not exists`

### `a.course < b.course`

Each unordered pair once, and no course paired with itself. Same reasoning as
questions 19 and 24: the two sides are interchangeable, so you need the `<`.

Using `<>` instead would list every pair twice, in both orders.

### The helper view earns its place

`q32big` is used **twice** in the join, so naming it avoids writing the
`group by ... having` twice and keeps the two copies guaranteed identical. The
exam explicitly permits helper views; a question this shape is where they pay
off.

### A note on cost

This is an expensive query — for every candidate pair it searches for a clashing
pair of classes. On 83 courses filtered to the big ones it is fine. On a million
courses it would not be, and the theory paper's question about correlated
subqueries being re-evaluated per outer row (theory module 37) is describing
exactly this shape.
