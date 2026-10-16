# Module 28

### The parameter

```python
cur.execute(""" ... where c.course = %s ... """, [course])
```

One placeholder, one value in a list. psycopg2 does the quoting.

Compare what the f-string version would have done with a course code containing
an apostrophe — it would have produced a syntax error. There are no such course
codes in this database, but the habit has to be automatic, because you will not
always know what is in the data.

### "No such course" has no table to check against

There is no `Courses` table. A course exists only because some class mentions
it. So the empty result **is** the no-such-course case:

```python
rows = cur.fetchall()
if not rows:
    print("No such course")
    return
```

Compare module 20, where `Rooms` does exist and you check with `if not found`.
**Look at the schema and ask what "does not exist" actually means** before
writing the branch.

`if not rows` is safe because `rows` is a list — `[]` is falsy and a non-empty
list never is. That is different from `fetchone()`, where a real row of `(0,)`
is also falsy and you must write `is None` (module 27).

### The header prints after the check

```python
if not rows: print("No such course"); return
print(course)
```

The spec says an unknown course produces *only* the error line, so the header
must come after the test. Getting that order wrong prints a course code
followed by nothing.

### The ordering is in SQL

`order by c.day_of_week` gives week order for free, because it is an enum
(module 06). Sorting in Python would need a `{'Mon':0, ...}` lookup — three
lines to reproduce something the database already does correctly.

### Try the injection, safely

```bash
./q28.py "COMP1927'; drop table Attends; --"
```

It prints `No such course`. The whole string was treated as one course code and
matched nothing, which is exactly right. Then check the table is still there:

```bash
psql -c "select count(*) from Attends"
```
