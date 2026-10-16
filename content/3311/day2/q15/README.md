# Question 15 &nbsp;·&nbsp; PLpgSQL &nbsp;·&nbsp; ★★★☆☆

## What's on in this room today?


```
create or replace function q15(_room integer, _day text) returns setof text
```

- no such room → one line `No such room`
- the room exists but has nothing on that day → one line
  `Nothing in ROOMNAME on DAY`
- otherwise one line per class, in start-time order:
  `S-E COURSE CTYPE (N students)`

```
psql -At -c "select * from q15(1003,'Thu');"
9-11 COMP1000 Lab Class (30 students)
...

psql -At -c "select * from q15(208,'Fri');"
Nothing in GOLDST-G01 on Fri
```

> **This is the shape of exam question 3** — a `setof text` function with a
> "no such X" line, a "nothing to report" line, and formatted rows otherwise.

<details><summary>Hint 1</summary>

Check the room first with `select ... into` + `if not found`, because you need
its **name** for the second message anyway.
</details>

<details><summary>Hint 2</summary>

Count the students per class with a subquery in the select list, or a `join
Attends` + `group by`.
</details>

<details><summary>Hint 3</summary>

`_day` arrives as `text`; compare with `c.day_of_week = _day::Weekday`, or
`c.day_of_week::text = _day`.
</details>
