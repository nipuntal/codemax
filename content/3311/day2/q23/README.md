# Question 23 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★★★★☆

## Which rooms work hardest?


A room's **weekly load** is the total number of hours of classes held in it.

**View** `q23(room, rtype, capacity, hours, nclasses)` for the rooms with the
**highest** weekly load. Show all rooms that tie for the maximum. Ordered by
room name.

> **Tests:** an aggregate over a computed value, then "the maximum, with ties"
> over that aggregate — the two ideas from questions 08 and 13 combined.

<details><summary>Hint 1</summary>

Hours for one class is `end_time - start_time`. Summing that per room gives the
load.
</details>

<details><summary>Hint 2</summary>

You cannot write `having sum(...) = max(sum(...))`. Compute the loads into a
helper view first, then compare against `(select max(hours) from thathelper)`.
</details>
