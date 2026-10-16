# Question 05 &nbsp;·&nbsp; PLpgSQL &nbsp;·&nbsp; ★☆☆☆☆

## Describe a room


Write a function that describes one room.

```
create or replace function q05(_id integer) returns text
```

- if there is no such room → return `No such room`
- otherwise return `NAME (TYPE, capacity N)`

```
q05(1003)  ->  MECH-G15 (Computer Lab, capacity 30)
q05(99999) ->  No such room
```

> **Tests:** `select ... into`, `if not found`, string building.
> This is the shape of every "no such X" branch in the exam.

<details><summary>Hint 1</summary>

`select * into r from Rooms where id = _id;` then `if not found then ... end if;`
</details>

<details><summary>Hint 2</summary>

`r.rtype` is an enum — concatenating it into text works directly.
</details>
