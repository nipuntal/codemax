# Question 04 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★☆☆☆☆

## Where does COMP1927 meet?


For every class in **COMP1927**, show what kind of class it is, when it runs,
and the **name** of the room it is held in.

**View** `q04(ctype, day, starts, ends, room)`, ordered by day of week, then
start time, then room name.

```
Mon|9|11|MECH-G15
...
```

> **Tests:** a join from `Classes` to `Rooms`.

<details><summary>Hint 1</summary>

`Classes.held_in` is a foreign key to `Rooms.id`.
</details>

<details><summary>Hint 2</summary>

`day_of_week` is an enum, so ordering by it gives Mon, Tue, Wed, Thu, Fri —
which is what you want, and is *not* what alphabetical order would give.
</details>
