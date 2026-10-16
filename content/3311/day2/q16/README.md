# Question 16 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★★★☆☆

## The biggest class in each course


For every course, find its **largest** class by enrolment. If two classes in a
course tie for largest, show both.

**View** `q16(course, ctype, day, starts, room, nstudents)`, ordered by course,
then day, then start time.

> **This is the shape of exam question 2** — "the fastest finisher for each
> event", ties included, ordering done by the view.

<details><summary>Hint 1</summary>

Build a helper view of `(class, course, size)` first, then select the rows whose
size equals the maximum **for their own course**.
</details>

<details><summary>Hint 2</summary>

That "maximum for their own course" is a correlated subquery — or `rank() over
(partition by course order by size desc)` and keep `rank = 1`.
</details>

<details><summary>Hint 3</summary>

`rank()` shares a number between ties; `row_number()` would invent a winner.
Use `rank()`.
</details>
