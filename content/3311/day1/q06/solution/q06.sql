-- Module 06 -- sample answer

drop view if exists q06 cascade;
create view q06(day, course, ctype, hours)
as
select day_of_week, course, ctype, end_time - start_time
from   Classes
where  end_time - start_time >= 3
order  by day_of_week, end_time - start_time desc, course
;
