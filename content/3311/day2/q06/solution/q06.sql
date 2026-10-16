-- Question 06 -- sample answer

drop view if exists q06 cascade;
create view q06(day, nclasses, nenrolments)
as
select c.day_of_week, count(distinct c.id), count(*)
from   Classes c join Attends a on a.class_id = c.id
group  by c.day_of_week
order  by c.day_of_week
;
