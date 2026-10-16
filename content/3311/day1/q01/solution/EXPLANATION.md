# Module 01

```sql
select name from Facilities
```

### What the view wrapper is doing

```sql
create view q01(facility) as select name from Facilities;
```

The `(facility)` renames the output column. Without it the column would be
called `name`, because that is what it is called in the table. It changes
nothing about the data — only the label on top.

That matters when a question asks for output "with headings X and Y". You supply
the headings in the brackets.

### The mistake everyone makes once

Leaving off the semicolon inside the view. The file needs one at the end:

```sql
create view q01(facility)
as
select name from Facilities
;                                <- this one
```

If you load the file and nothing happens, that is why.

### Reading an error

Try deliberately breaking it — `select nam from Facilities` — and load the file:

```
psql:q01.sql:7: ERROR:  column "nam" does not exist
LINE 5: select nam from Facilities
               ^
```

It gives you the file, the line number and a `^` pointing at the problem.
PostgreSQL's error messages are unusually good; read them rather than guessing.

### Worth trying

```sql
select * from Facilities;         -- both columns
select id from Facilities;        -- just the numbers
select name, id from Facilities;  -- reversed
```
