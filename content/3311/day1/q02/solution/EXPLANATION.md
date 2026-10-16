# Module 02

```sql
select course,
       day_of_week,
       start_time || '-' || end_time,
       end_time - start_time
from   Classes
```

### Two computed columns

`start_time || '-' || end_time` builds a piece of text out of a number, a
literal, and another number. PostgreSQL converts the numbers to text
automatically, so no `::text` is needed.

`end_time - start_time` is plain arithmetic on two whole numbers, giving a whole
number. Since nothing is divided, the whole-number trap from the LEARN FIRST
section doesn't apply — but keep it in mind, because it will.

### Why the view's column names matter here

Two of the four columns are expressions, not real columns. Without the names in
`create view q02(course, day, span, hours)`, PostgreSQL would invent names like
`?column?`. The brackets give them proper headings.

This is the normal case in exam questions: you are usually asked for computed
values with specified headings.

### `course` is a fixed-width column

`Classes.course` is declared `char(8)` — always exactly 8 characters, padded
with spaces if the value is shorter. Every course code here happens to be
exactly 8 characters (`COMP1000`), so you will never see the padding.

It is worth knowing anyway: if you ever glue a `char(n)` column into a longer
string and see unexpected spaces, that is why. `trim(x)` removes them.

### Worth trying

```sql
select 9 || '-' || 11;                   -- 9-11
select 11 - 9;                           -- 2
select course || ' runs ' || (end_time - start_time) || ' hours'
from Classes limit 5;
```

That last one shows something useful: you can put brackets around an expression
inside a `||` chain to control what happens first.
