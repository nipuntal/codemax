# Module 00

```sql
select (select count(*) from Students),
       (select count(*) from Rooms),
       (select count(*) from Classes)
```

### A `select` with no `from`

You can select plain expressions with no table at all:

```sql
select 1 + 1;        -- 2
select 'hello';      -- hello
```

That's all this answer is doing — three expressions, each of which happens to be
a small query in brackets. Each returns a single number, so the result is one
row of three columns.

### Why brackets

A query in brackets used as a value has to produce **exactly one row and one
column**. `select count(*) from Students` does, so it's allowed. Something like
`(select name from Students)` would not be — 7,784 rows is not a single value,
and PostgreSQL would refuse it.

### Numbers worth remembering

```
7784 students | 128 rooms | 514 classes | 16 facilities | 578 has | 18917 attends
```

Keep them in your head. When a query comes back with 18,917 rows you will know
instantly that you have accidentally fetched all of `Attends`.

### Things to try before moving on

```sql
\dt
\d Students
\d Classes
\d Attends

select * from Rooms limit 5;
select * from Facilities;
select * from Classes limit 5;
```

`limit 5` just means "stop after 5 rows" — handy for peeking at a big table
without flooding your screen.

Look especially at `\d Classes`. At the bottom it lists the foreign key
`held_in` pointing at `Rooms(id)`, and the `check` constraints on the times.
Everything section 4 and 6 described is written there, in the database's own
words.
