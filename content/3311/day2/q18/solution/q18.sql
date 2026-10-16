-- Question 18 -- sample answer

drop view if exists q18 cascade;
create view q18(rtype, nclasses, ncourses)
as
select m.rtype, count(*), count(distinct c.course)
from   Classes c join Rooms m on c.held_in = m.id
where  c.ctype = 'Lab Class'
  and  m.rtype <> 'Computer Lab'
group  by m.rtype
order  by count(*) desc, m.rtype
;
