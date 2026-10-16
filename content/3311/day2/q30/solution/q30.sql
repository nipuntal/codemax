-- Question 30 -- sample answer

drop view if exists q30 cascade;
create view q30(course, ntutelabs, in_lab, in_tute, elsewhere)
as
select c.course,
       count(*),
       count(*) filter (where m.rtype = 'Computer Lab'),
       count(*) filter (where m.rtype = 'Tutorial Room'),
       count(*) filter (where m.rtype not in ('Computer Lab','Tutorial Room'))
from   Classes c join Rooms m on c.held_in = m.id
where  c.ctype = 'Tute-Lab'
group  by c.course
having count(*) >= 3
order  by count(*) desc, c.course
;
