# Question 32 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★★★★★

## Which pairs of courses could a student take together?


Two courses are **compatible** if **no** class of one clashes with **any** class
of the other.

Restrict attention to courses that run **at least 8** classes, and report only
pairs that are compatible.

**View** `q32(course1, course2, nclasses1, nclasses2)` with `course1 <
course2`, ordered by `course1` then `course2`.

> **Tests:** a "for all" over *pairs*, on top of the overlap logic. This is the
> hardest SQL in the set.

<details><summary>Hint 1</summary>

"No class of A clashes with any class of B" is `not exists (a clashing pair)`.
</details>

<details><summary>Hint 2</summary>

Build a helper view of the big courses first, then join it to itself with
`c1.course < c2.course` to get each unordered pair once.
</details>

<details><summary>Hint 3</summary>

The inner `not exists` needs to refer to **both** courses from the outer query —
that is a correlated subquery with two correlations.
</details>
