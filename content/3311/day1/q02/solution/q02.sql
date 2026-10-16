-- Module 02 -- sample answer

drop view if exists q02 cascade;
create view q02(course, day, span, hours)
as
select course,
       day_of_week,
       start_time || '-' || end_time,
       end_time - start_time
from   Classes
;
