-- Module 14 -- sample answer

drop view if exists q14 cascade;
create view q14(room, course, ctype, day, start_time)
as
select r.name, c.course, c.ctype, c.day_of_week, c.start_time
from   Classes c join Rooms r on c.held_in = r.id
where  c.start_time = (select min(c2.start_time)
                       from   Classes c2
                       where  c2.held_in = c.held_in)
order  by r.name, c.day_of_week, c.course
;
