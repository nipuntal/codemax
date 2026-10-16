-- Module 08 -- sample answer

drop view if exists q08 cascade;
create view q08(day, nclasses, ncourses, first_start, last_end)
as
select day_of_week,
       count(*),
       count(distinct course),
       min(start_time),
       max(end_time)
from   Classes
group  by day_of_week
order  by day_of_week
;
