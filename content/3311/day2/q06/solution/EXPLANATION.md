# Question 06

```sql
select c.day_of_week, count(distinct c.id), count(*)
from   Classes c join Attends a on a.class_id = c.id
group  by c.day_of_week
order  by c.day_of_week
```

### `count(distinct c.id)` is the point of this question

Joining `Classes` to `Attends` gives **one row per enrolment**. A class with 40
students appears 40 times. So:

- `count(*)` counts enrolment rows → the number of enrolments ✓
- `count(c.id)` would also count 40 → wrong for "how many classes"
- `count(distinct c.id)` counts each class once ✓

**Whenever you join one-to-many and then count the "one" side, you need
`distinct`.** This is the single most common wrong answer in questions of this
shape, and it appears again in questions 16, 21 and 30.

### Why an inner join is safe here

Every class in this database has at least one student, so no class is lost. If
that weren't guaranteed — and in the exam's data it might not be — you'd want a
`left join` and `count(a.student_id)` so empty classes still reported 0.

Check the assumption rather than trusting it:

```sql
select count(*) from Classes c
where not exists (select 1 from Attends a where a.class_id = c.id);
```
