# Question 35 &nbsp;·&nbsp; SQL &nbsp;·&nbsp; ★★★★★

## Which rooms could stand in for which?


Room B **can substitute** for room A if B is a different room, B's capacity is
at least A's, and B has **every facility** that A has.

For each **Lecture Theatre**, count its substitutes.

**View** `q35(room, capacity, nfacilities, nsubs)`, ordered by `nsubs`
descending, then room name.

> **Tests:** division — "has every facility that A has" — inside a per-room
> count. The classic "for all" shape, on real data.

<details><summary>Hint 1</summary>

B has all of A's facilities ⟺ there is **no** facility of A that B lacks.
</details>

<details><summary>Hint 2</summary>

```sql
not exists (
    select 1 from Has ha where ha.room_id = a.id
      and not exists (select 1 from Has hb
                      where hb.room_id = b.id
                        and hb.facility_id = ha.facility_id)
)
```
</details>

<details><summary>Hint 3</summary>

Counting substitutes per room is a correlated subquery in the select list, or a
`left join` to a substitutes view plus a `group by`.
</details>
