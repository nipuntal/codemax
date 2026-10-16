-- Module 13 -- sample answer

drop view if exists q13 cascade;
create view q13(room, capacity, course, ctype, day, start_time)
as
select r.name, r.capacity, c.course, c.ctype, c.day_of_week, c.start_time
from   Classes c join Rooms r on c.held_in = r.id
where  r.capacity = (select max(capacity) from Rooms)
order  by r.name, c.day_of_week, c.start_time, c.course
;
