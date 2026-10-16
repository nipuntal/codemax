# Question 09 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★★☆☆☆

## Who is enrolled in nothing?


Some students are in the database but scheduled to attend no classes at all.
List them.

**View** `q09(id, name)`, ordered by name then id.

> **Tests:** finding rows with **no** match. Expect a small answer.

<details><summary>Hint 1</summary>

Two standard ways: `not exists (...)`, or a `left join` with
`where ... is null`.
</details>

<details><summary>Hint 2</summary>

Why `, id` in the ordering? Because 65 names in this database are shared by more
than one student.
</details>
