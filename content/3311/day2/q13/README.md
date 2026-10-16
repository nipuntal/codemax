# Question 13 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★★★☆☆

## The biggest room on campus


Which room has the largest capacity, and how many classes are held in it?

**View** `q13(room, rtype, capacity, nclasses)`, ordered by room name.

> **This is the shape of exam question 1.** Past papers phrase it as
> "the oldest participant(s)" or "the suburb with the most customers", and in
> **every** case the answer has **more than one row** — the marking is checking
> that you did not silently drop the ties.

<details><summary>Hint 1</summary>

`order by capacity desc limit 1` gives **one** room. There are two rooms of
equal maximum capacity, so that answer is wrong.
</details>

<details><summary>Hint 2</summary>

`where capacity = (select max(capacity) from Rooms)`
</details>
