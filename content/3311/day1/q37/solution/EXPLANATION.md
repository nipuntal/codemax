# Module 37

### Three queries, one per grain

Each line of the report asks a question at a different level — per class, per
class-with-room, per enrolment. Forcing them into one query would need several
`with` clauses and would be far harder to debug than three plain statements.

**In an exam, write the query for line 2, run it, print it. Then line 3.** If
time runs out you have a partial report that works.

### The existence check rides on the first query

```python
(nclasses, ndays, nhours) = cur.fetchone()
if nclasses == 0:
    print("No such course")
    return
```

An aggregate always returns a row (modules 20, 27, 30), so `fetchone()` is never
`None` — the test is `nclasses == 0`. Getting a free existence check out of a
query you needed anyway is worth doing.

Note the header prints **after** the check, because the spec says an unknown
course produces only the error line.

### `count(distinct ...)` three times

- `count(distinct day_of_week)` — a course runs many classes per day
- `count(distinct r.id)` — many classes in the same room
- `count(distinct a.student_id)` — a student may attend several classes of the
  same course, a lecture **and** a tutorial

That last one is the subtle one. `nstu` is how many **people**; `nenrol` is how
many enrolment rows. They are different numbers, and mixing them up is the most
likely error in this question.

### Both divisions are guarded

```python
avg_hours = nhours / nclasses if nclasses else 0
per       = nenrol  / nclasses if nclasses else 0
```

We return early when `nclasses == 0`, so the guards can never fire — but writing
them is the habit, and it costs nothing.

Note these are ordinary Python divisions, so they give a float. That is fine —
unlike SQL, Python's `/` does not throw the fraction away (module 02's trap is
SQL-specific).

### The labels

```python
f"  {'classes:':<10}{nclasses} across ..."
```

Two spaces, then the label padded to 10 so the values line up in a column. The
label **includes its own colon** — padding `'classes'` and adding `:` afterwards
would put the colon at column 13 and misalign everything.

### `coalesce(sum(...), 0)`

`sum` over no rows is null (modules 12, 20). Here we return before using it, but
making the query hand back sensible values keeps the Python simple.
