# Module 03

```sql
select course, day_of_week, start_time, end_time
from   Classes
where  ctype = 'Lecture'
  and  start_time <= 12
  and  end_time - start_time > 1
```

### Reading the words precisely

- "**at or before** 12" is `<= 12`, not `< 12`.
- "**more than** one hour" is `> 1`, not `>= 1`.

Those two are opposite ways round, which is exactly the sort of thing an exam
question does on purpose. Slow down on the comparison words.

### A condition can use more than one column

`end_time - start_time > 1` compares a computed value against 1. The `where`
clause can contain any expression that comes out true or false, not just simple
column-versus-value tests.

### Why the enum spelling is safe

`ctype = 'Lecture'` works. `ctype = 'lecture'` gives:

```
ERROR:  invalid input value for enum classtype: "lecture"
```

A loud failure rather than a quietly empty result. This is one of the few places
where being strict actually helps you — compare it with misspelling an ordinary
text value, which just returns nothing and leaves you puzzled.

The valid values, from module 00: `Lecture`, `Tutorial`, `Seminar`,
`Lab Class`, `Tute-Lab`.

### The layout

Putting `select`, `from` and `where` on their own lines, with the extra
conditions indented under `where`, is not decoration. Once a query has five
clauses it is the only way to see its shape at a glance — and the exam gives
marks for working that can be followed.

### Worth trying

```sql
-- watch the brackets change the answer
select count(*) from Classes where ctype='Lecture' and start_time=9 or start_time=10;
select count(*) from Classes where ctype='Lecture' and (start_time=9 or start_time=10);
```
