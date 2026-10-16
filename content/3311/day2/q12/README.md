# Question 12 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★★☆☆☆

## Back-to-back in the same lab


A class ends and another starts **immediately** in the same Computer Lab.

**View** `q12(room, day, first_course, then_course, changeover)` where
`changeover` is the hour the first ends and the second begins.

Ordered by room, day, changeover.

> **Tests:** joining a table to itself.

<details><summary>Hint 1</summary>

Mention `Classes` twice with different aliases. The link is
`a.held_in = b.held_in and a.day_of_week = b.day_of_week and a.end_time =
b.start_time`.
</details>

<details><summary>Hint 2</summary>

You do **not** want `a.id < b.id` here — the two sides mean different things
(the earlier class and the later one), and the time condition already orders
them.
</details>
