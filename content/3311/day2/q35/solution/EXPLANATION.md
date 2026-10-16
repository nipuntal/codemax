# Question 35

### The double `not exists` is division

```sql
not exists (                       -- there is no ...
    select 1 from Has ha
    where  ha.room_id = a.id       -- ... facility of A ...
      and  not exists (            -- ... that ...
               select 1 from Has hb
               where hb.room_id = b.id and hb.facility_id = ha.facility_id
           )                       -- ... B does not also have
)
```

Read it inside out: *B lacks facility f* is the inner `not exists`. *A has a
facility that B lacks* is the middle layer. *B has all of A's facilities* is the
outer negation.

This is the relational-algebra **division** operator written in SQL, and the
double negative is the standard way to express it. It is worth being able to
write from muscle memory — the theory paper asks about it too (module 31 of the
theory lab).

### The `except` form

The course's other spelling of the same idea:

```sql
not exists (
    (select facility_id from Has where room_id = a.id)
    except
    (select facility_id from Has where room_id = b.id)
)
```

*A's facilities minus B's facilities is empty.* Shorter and, for most people,
easier to get the right way round. **`required except owned`** — write that on
your hand.

### The counting form

```sql
(select count(*) from Has where room_id = a.id) =
(select count(*) from Has ha join Has hb
   on ha.facility_id = hb.facility_id
 where ha.room_id = a.id and hb.room_id = b.id)
```

*B matches all of A's facilities.* Works, and is often faster, but is easier to
get subtly wrong if a room could list a facility twice — here the primary key
`(room_id, facility_id)` guarantees it cannot, so it is safe.

Know at least two of the three. Under pressure, one will come out right.

### `order by 4 desc`

Ordering by output column **position** — the fourth column, `nsubs`. Repeating
the whole correlated subquery in the `order by` would be legal and horrible.
Positions are fragile if the column list changes, so use them only when the
alternative is worse. Here it clearly is.

### Reading the result

The two 400-seat theatres have **0** substitutes: nothing else is big enough.
Small, sparsely-equipped rooms have many. That inverse relationship is a good
sanity check that your division is the right way round — if your biggest rooms
have the *most* substitutes, you have the comparison backwards.
