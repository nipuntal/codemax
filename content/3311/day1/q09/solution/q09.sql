-- Module 09 -- sample answer

drop view if exists q09 cascade;
create view q09(course, nclasses, nhours, ndays)
as
select course,
       count(*),
       sum(end_time - start_time),
       count(distinct day_of_week)
from   Classes
group  by course
having count(*) > 15 and sum(end_time - start_time) > 30
order  by sum(end_time - start_time) desc, course
;
