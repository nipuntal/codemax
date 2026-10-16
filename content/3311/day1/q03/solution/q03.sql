-- Module 03 -- sample answer

drop view if exists q03 cascade;
create view q03(course, day, start_time, end_time)
as
select course, day_of_week, start_time, end_time
from   Classes
where  ctype = 'Lecture'
  and  start_time <= 12
  and  end_time - start_time > 1
;
