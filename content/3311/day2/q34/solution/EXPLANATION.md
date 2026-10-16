# Question 34

### Flat rows in, 2-D grid out

The database has no concept of a grid. You get `(day, hour, course)` triples and
build the layout in Python:

```python
grid = {}
for (day, hour, course) in cur.fetchall():
    grid.setdefault((day, hour), course.strip())
```

A dict keyed by a **tuple** is the natural structure. `setdefault` writes only
if the key is absent, so combined with `order by c.course` the
alphabetically-first course wins a contested cell — which is what the spec asked
for, and this room genuinely has contested cells.

### `.strip()` on the course code

`course` is `char(8)`. Every code here is exactly 8 characters so there is no
padding to remove — but `char(n)` values arrive **blank-padded to n** in
general, and a stray trailing space inside a width-9 field is invisible on
screen and fatal to the comparison. Stripping costs nothing and removes the
whole class of problem.

### `rstrip()` on every line

```python
print(f"{hour:>2}   {cells}".rstrip())
```

Friday's cell is padded to width 9, so an empty Friday leaves eight trailing
spaces. The spec says strip them — and even when a spec doesn't say, trailing
whitespace is the most common reason a visually-correct answer fails an exact
comparison.

Build the padded line, then strip the end. Don't try to avoid padding the last
column; that's fiddlier and easier to get wrong.

### `range(9, 21)`

Hours 9 through 20 inclusive. The schema's checks put `start_time` between 9 and
20 and `end_time` between 10 and 21, so hour 20 is the last one a class can
occupy. Getting this from the **schema constraints** rather than from the data
is the robust move — today's data might not use every hour.

### Iterate `DAYS`, not the dict

Same lesson as question 20. A day with nothing on never becomes a key, and
iterating the dict would drop the column entirely, shifting every later column
left.
