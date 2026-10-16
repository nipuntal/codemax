# Question 01 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★☆☆☆☆

## What kinds of rooms are there?


Get your bearings. For each type of room, report how many rooms there are and
the smallest and largest capacity of that type.

**View** `q01(rtype, nrooms, smallest, largest)`, ordered by `rtype`.

```
Computer Lab|10|20|30
Lecture Theatre|18|30|400
...
```

> **Tests:** `group by`, `count`, `min`/`max`.
> The view must do its own ordering — the check does not add an `order by`.

<details><summary>Hint</summary>

One table, one `group by rtype`. Everything else is an aggregate.
</details>
