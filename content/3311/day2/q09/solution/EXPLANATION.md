# Question 09

```sql
select s.id, s.name from Students s
where  not exists (select 1 from Attends a where a.student_id = s.id)
order  by s.name, s.id
```

Eleven students. The equivalent with an outer join:

```sql
select s.id, s.name
from   Students s left join Attends a on a.student_id = s.id
where  a.student_id is null
order  by s.name, s.id;
```

Both are taught in this course and both are accepted.

### Why not `not in`

```sql
where s.id not in (select student_id from Attends)      -- risky
```

If the subquery ever yields a **null**, `not in` returns *unknown* for every row
and you get **no rows at all**, silently. `Attends.student_id` can't be null
here, so it works — but `not exists` is immune by construction and is the habit
worth having.

### The tie-break on `id`

65 names are shared. `order by s.name` alone leaves same-named students in
arbitrary order, and the check compares text exactly. **In this database, always
add `id` to an ordering that involves a student name.**
