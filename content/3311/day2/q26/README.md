# Question 26 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★★★★☆

## Teaching space by building


Room names look like `EE-417`, `GOLDST-G01`, `K17-G12` — a building code, a
dash, then the room. Three rooms have no dash at all.

**View** `q26(building, nrooms, seats, nclasses, hours)` — per building: how
many rooms, total capacity, how many classes are held there, and total hours of
teaching. Buildings with **at least 5 rooms** only.

Ordered by total hours descending, then building.

Rooms whose name contains no dash belong to a building called `(none)`.

> **Tests:** deriving a grouping key with a string function, and being careful
> about the rows that don't fit the pattern.

<details><summary>Hint 1</summary>

`split_part(name, '-', 1)` gives everything before the first dash — and gives
the **whole name** when there is no dash, which is not what you want.
</details>

<details><summary>Hint 2</summary>

`case when name like '%-%' then split_part(name,'-',1) else '(none)' end`
</details>

<details><summary>Hint 3</summary>

Classes and hours need a `left join`, so a building whose rooms are unused still
reports 0.
</details>
