-- Question 12 -- sample answer

drop view if exists q12 cascade;
create view q12(room, day, first_course, then_course, changeover)
as
select m.name, a.day_of_week, a.course, b.course, a.end_time
from   Classes a
       join Classes b on a.held_in    = b.held_in
                     and a.day_of_week = b.day_of_week
                     and a.end_time    = b.start_time
       join Rooms m on a.held_in = m.id
where  m.rtype = 'Computer Lab'
order  by m.name, a.day_of_week, a.end_time
;
