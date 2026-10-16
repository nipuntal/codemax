# Question 08

```sql
select course, count(*) from Classes
group  by course
having count(*) > 20
order  by count(*) desc, course
```

### Why `having` and not `where`

The order things happen is:

```
from → where → group by → having → select → order by
```

When `where` runs the groups do not exist yet, so `count(*)` is meaningless
there. PostgreSQL says so plainly:

```
ERROR: aggregate functions are not allowed in WHERE
```

`having` runs after the grouping and can see the counts.

**`where` filters rows, `having` filters groups.** A question that says
"courses with more than N classes" filters groups; one that says "classes
starting after 5pm" filters rows; one that says both needs both clauses.

### Ordering by an aggregate

`order by count(*) desc` is legal and needs no alias. The `, course` tie-break
matters as always — and here it genuinely bites if two courses ever tie.
