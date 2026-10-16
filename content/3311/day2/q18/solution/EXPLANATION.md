# Question 18

```sql
select m.rtype, count(*), count(distinct c.course)
from   Classes c join Rooms m on c.held_in = m.id
where  c.ctype = 'Lab Class' and m.rtype <> 'Computer Lab'
group  by m.rtype
order  by count(*) desc, m.rtype
```

### The rule came from the prose, not the schema

Nothing in the SQL schema stops a lab class being booked into a lecture theatre.
The constraint is stated only in the **scenario description** — which is exactly
how exam questions are written. Read the words above the schema as carefully as
the schema.

114 lab classes are in the wrong sort of room, most of them in tutorial rooms.

### `count(*)` versus `count(distinct c.course)`

Two counts of the same group answering different questions:

- `count(*)` — how many class offerings
- `count(distinct c.course)` — how many courses are affected

One course running twelve mis-roomed labs is a different problem from twelve
courses running one each. Being able to produce both in one pass is the
technique here.

### Going further

The full "appropriate room" question would need a mapping for every class type,
and the schema comment hints that `Tute-Lab` is a special case — *"a tutorial
class in a tutorial room followed immediately by a lab class generally in a
computer lab"*. That word **generally** is doing a lot of work, and any question
about Tute-Labs has to say what it means. Question 30 comes back to this.

If you ever have to invent the mapping yourself, **state your assumption in a
comment**. A defensible assumption clearly stated scores; a silent guess does
not.
