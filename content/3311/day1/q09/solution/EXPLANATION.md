# Module 09

```sql
select course, count(*), sum(end_time - start_time), count(distinct day_of_week)
from   Classes
group  by course
having count(*) > 15 and sum(end_time - start_time) > 30
order  by sum(end_time - start_time) desc, course
```

### Both conditions are about piles

"More than 15 classes" and "more than 30 hours" are both properties of a whole
course, not of any single class. So both belong in `having`. Neither could go in
`where` — try it and read the error.

Compare: "only count lectures" *would* be a `where`, because it is a fact about
each individual class.

### Aggregates repeated in three places

`sum(end_time - start_time)` appears in the `select`, the `having` and the
`order by`. That is normal — SQL gives you no way to name it once and reuse it
within the same query. (You can name it with `as` and use that name in
`order by` only, as module 06 noted.)

If the repetition bothers you, that is a healthy instinct — there is a tidier
way to structure this kind of query, but it needs a tool we have not met yet.
For now, repeat it.

### `count(distinct day_of_week)`

A course runs many classes on the same day, so counting rows would be wrong for
"how many days". Module 08's lesson again — and it will keep coming back.

### Ordering by an aggregate

`order by sum(...) desc` is legal and needs no alias. The `, course` tie-break
matters as always: two courses could easily total the same hours.

### Reading the answer

Four courses come through. Look at the relationship between classes and hours —
a course with many short tutorials and one with fewer long labs can end up at
the same total. The `nclasses` and `nhours` columns measure genuinely different
things, which is why the question asked for both.

### Worth trying

```sql
-- the error the rule predicts
select course, count(*) from Classes where count(*) > 20 group by course;

-- where and having together
select course, count(*) from Classes
where ctype = 'Lecture' group by course having count(*) >= 3 order by 2 desc;

-- having with no group by treats the whole table as one pile
select count(*) from Classes having count(*) > 100;
```
