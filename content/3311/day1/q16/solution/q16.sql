-- Module 16 -- sample answer

drop view if exists q16 cascade;
create view q16(course, nclasses, nrooms)
as
select c.course, count(*), count(distinct c.held_in)
from   Classes c
where  not exists (
           select 1
           from   Classes c2 join Rooms m on c2.held_in = m.id
           where  c2.course = c.course
             and  m.rtype <> 'Tutorial Room'
       )
group  by c.course
having count(*) >= 3
order  by c.course
;
