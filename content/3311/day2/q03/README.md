# Question 03 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★☆☆☆☆

## Say hello to the database


Print a one-line summary of the database, exactly:

```
7784 students, 128 rooms, 514 classes, 18917 enrolments
```

Takes no arguments; if any are supplied, print `USAGE` and stop.

> **Tests:** connecting, one query, `fetchone`, an f-string.

<details><summary>Hint</summary>

You can get all four numbers in one query with four scalar subqueries, then a
single `fetchone()`.
</details>
