-- Question 16 -- sample answer

drop view if exists q16 cascade;
drop view if exists q16sizes cascade;

create view q16sizes(class, course, nstudents)
as
select c.id, c.course, count(*)
from   Classes c join Attends a on a.class_id = c.id
group  by c.id, c.course
;

create view q16(course, ctype, day, starts, room, nstudents)
as
select z.course, c.ctype, c.day_of_week, c.start_time, m.name, z.nstudents
from   q16sizes z
       join Classes c on z.class = c.id
       join Rooms   m on c.held_in = m.id
where  z.nstudents = (select max(z2.nstudents) from q16sizes z2
                      where z2.course = z.course)
order  by z.course, c.day_of_week, c.start_time
;
