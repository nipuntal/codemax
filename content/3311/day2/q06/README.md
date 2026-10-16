# Question 06 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★★☆☆☆

## How busy is each day?


For each day of the week, report how many classes are scheduled and how many
enrolments there are in total across those classes.

**View** `q06(day, nclasses, nenrolments)`, in week order (Mon first).

```
Mon|88|3223
...
```

> **Tests:** joining before grouping, and `count(distinct)`.

<details><summary>Hint 1</summary>

Enrolments live in `Attends`, so you must join. But joining multiplies the class
rows — one per enrolment.
</details>

<details><summary>Hint 2</summary>

`count(distinct c.id)` for classes; `count(*)` for enrolments.
</details>
