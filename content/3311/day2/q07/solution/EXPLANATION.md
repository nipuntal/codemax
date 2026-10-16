# Question 07

### "No such course" has no table to check against

There is no `Courses` table — a course exists only because some class mentions
it. So the empty-result *is* the no-such-course case:

```python
rows = cur.fetchall()
if not rows:
    print("No such course")
    return
```

Contrast question 05, where `Rooms` exists and you check with `if not found`.
**Look at the schema and ask what "doesn't exist" actually means** before writing
the branch.

Here `if not rows` is safe because `rows` is a list — `[]` is falsy and a
non-empty list never is. That's different from `fetchone()`, where a real row of
`(0,)` is also falsy and you must write `is None`.

### `course` is `char(8)`

`where c.course = %s` with `'COMP1927'` works because both sides are 8
characters. Pass a shorter string and `char` padding still makes it match:
`'COMP1927 '` would too. Nothing to worry about here, but know that `char(n)`
comparisons ignore trailing spaces.

### The ordering is in SQL, not Python

`order by c.day_of_week` uses the enum's week order for free. Sorting in Python
would need a `{'Mon':0,...}` lookup — three extra lines to reproduce something
the database does correctly by itself.
