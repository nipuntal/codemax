-- Module 10 -- sample answer

drop view if exists q10 cascade;
create view q10(course, ctype, day, span, room, rtype, capacity)
as
select c.course,
       c.ctype,
       c.day_of_week,
       c.start_time || '-' || c.end_time,
       r.name,
       r.rtype,
       r.capacity
from   Classes c join Rooms r on c.held_in = r.id
where  r.rtype = 'Computer Lab'
order  by c.day_of_week, c.start_time, r.name
;
