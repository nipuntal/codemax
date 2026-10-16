-- Question 04 -- sample answer

drop view if exists q04 cascade;
create view q04(ctype, day, starts, ends, room)
as
select c.ctype, c.day_of_week, c.start_time, c.end_time, r.name
from   Classes c join Rooms r on c.held_in = r.id
where  c.course = 'COMP1927'
order  by c.day_of_week, c.start_time, r.name
;
