-- Module 11 -- sample answer

drop view if exists q11 cascade;
create view q11(room, day, start_time, course1, course2)
as
select r.name, a.day_of_week, a.start_time, a.course, b.course
from   Classes a
       join Classes b on a.held_in     = b.held_in
                     and a.day_of_week = b.day_of_week
                     and a.start_time  = b.start_time
                     and a.id          < b.id
       join Rooms   r on a.held_in     = r.id
order  by r.name, a.day_of_week, a.start_time, a.course, b.course
;
