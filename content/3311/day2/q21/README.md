# Question 21 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★★★★☆

## Courses that are always properly equipped


A course is **fully equipped** if **every one** of its classes is held in a room
that has a `Video data projector`.

**View** `q21(course, nclasses, nrooms)` — the course code, how many classes it
runs, and how many distinct rooms it uses. Ordered by course.

> **Tests:** a "for all" question. There is no `for all` in SQL, so you have to
> turn it inside out.

<details><summary>Hint 1</summary>

"Every class satisfies P" is the same as "there is **no** class that fails P".
</details>

<details><summary>Hint 2</summary>

```sql
where not exists (
    select 1 from Classes c2
    where c2.course = <this course>
      and not exists (select 1 from Has h join Facilities f on ...
                      where h.room_id = c2.held_in and f.name = 'Video data projector')
)
```
</details>

<details><summary>Hint 3</summary>

The counting alternative: a course qualifies when its number of classes in
equipped rooms equals its total number of classes.
</details>
