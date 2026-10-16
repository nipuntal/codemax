# Module 33 &nbsp;·&nbsp; Python + Psycopg2

## Using the views and functions you already wrote


## LEARN FIRST

Everything you built in modules 00–24 is still sitting in the database, and
Python can use all of it.

### Calling a view

A view is a saved query with a name (module 17). To Python it is just a table:

```python
cur.execute("select * from q18")
```

### Calling a function that returns one value

```python
cur.execute("select q19(%s)", [400])
band = cur.fetchone()[0]           # 'large'
```

### Calling a function that returns many rows

Put it in the `from` clause — that is what `returns setof` is for (module 22):

```python
cur.execute("select * from q22(%s)", ['COMP1927'])
for (line,) in cur.fetchall():
    print(line)
```

Note the `(line,)` — one selected column, so each row is a one-element tuple
(module 27).

### Creating a helper from inside the script

Nothing stops your script defining a view before using it:

```python
cur.execute("""
    create or replace view helper(course, nclasses) as
    select course, count(*) from Classes group by course
""")
cur.execute("select * from helper where nclasses > 20")
```

`create or replace` matters: without it, the **second** run of your script fails
with `relation "helper" already exists`. Anything a script creates should be
safe to create again.

### Why this matters for the exam

The exam gives you one file per question. A Python question is marked by running
your `.py` file — so if your script depends on a view that nothing creates, it
fails.

Two safe approaches:

**1. Create the helper inside the script**, as above. Self-contained, always
works.

**2. Do not use a helper** — put the query inline, using `with` (module 17) to
keep it readable. Usually better, and leaves nothing behind.

Some exam questions **do** give you a `.sql` file alongside the `.py` file, and
then helpers are expected. **Read the question's file list**: if it mentions a
`.sql` file among the things you submit, use it; if it only gives you a `.py`,
keep everything inside the script.

### A change needs saving

If your script creates a view and you want it to still be there afterwards, the
change has to be made permanent:

```python
db.commit()
```

Within a single run you can use the view without committing — your own session
can see its own changes. It is only other sessions, and later runs, that need
the commit. Module 31's theory pointer covers why.

---

## THE TASK

Write a script that builds a helper view and then uses it twice.

```
$ ./q33.py 3
courses using at least 3 rooms:
COMP1917 uses 20 rooms for 47 classes
COMP2911 uses 12 rooms for 25 classes
...
49 courses qualify, out of 83
```

Given a minimum number of rooms:

- create (or replace) a view called `q33helper(course, nrooms, nclasses)` giving,
  for every course, how many distinct rooms it uses and how many classes it runs
- print `courses using at least N rooms:`
- then one line per qualifying course: `COURSE uses R rooms for C classes`,
  most rooms first, then by course code
- then a final line: `Q courses qualify, out of T` where `T` is the total number
  of courses
- if none qualify, print the header, then the final line with `0`
- non-numeric or wrong-count arguments → `USAGE`

## Hints

<details><summary>Hint 1</summary>

Three `execute` calls: create the view, query it with `%s`, and count the total
courses (which you can also get from the view).
</details>

<details><summary>Hint 2</summary>

The view's body is module 32's query.
</details>

<details><summary>Hint 3</summary>

`create or replace view` so a second run does not fail.
</details>
