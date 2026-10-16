-- Question 32 -- sample answer

drop view if exists q32 cascade;
drop view if exists q32big cascade;

create view q32big(course, nclasses)
as
select course, count(*)
from   Classes
group  by course
having count(*) >= 8
;

create view q32(course1, course2, nclasses1, nclasses2)
as
select a.course, b.course, a.nclasses, b.nclasses
from   q32big a join q32big b on a.course < b.course
where  not exists (
           select 1
           from   Classes x join Classes y
                    on x.day_of_week = y.day_of_week
                   and x.start_time  < y.end_time
                   and y.start_time  < x.end_time
           where  x.course = a.course
             and  y.course = b.course
       )
order  by a.course, b.course
;
