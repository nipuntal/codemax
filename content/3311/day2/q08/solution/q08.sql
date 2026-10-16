-- Question 08 -- sample answer

drop view if exists q08 cascade;
create view q08(course, nclasses)
as
select course, count(*)
from   Classes
group  by course
having count(*) > 20
order  by count(*) desc, course
;
