# Question 03

```python
cur.execute("""
    select (select count(*) from Students), (select count(*) from Rooms),
           (select count(*) from Classes),  (select count(*) from Attends)
""")
(ns, nr, nc, na) = cur.fetchone()
print(f"{ns} students, {nr} rooms, {nc} classes, {na} enrolments")
```

Four scalar subqueries, one round trip, one `fetchone()`. Four separate
`execute` calls would be equally correct.

### `fetchone()` gives a tuple

Even for one column. Selecting four columns and unpacking into four names is
the tidy version; `cur.fetchone()[0]` is what you need when there is only one.

### The connection

`psycopg2.connect(dbname="classes")` — with no host or port, exactly as the exam
template writes it. That works here because `env` exports `PGHOST` and `PGPORT`,
so libpq picks them up. **Never add host/port arguments to an exam answer.**

### Remember the numbers

7784 students, 128 rooms, 514 classes, 18917 enrolments. When a later query
returns 18917 rows you'll know instantly that you forgot a `where`.
