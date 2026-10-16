-- Module 17 -- sample answer

drop view if exists q17 cascade;
create view q17(course, nclasses, avg_size)
as
with sizes as (
    select c.id as class, c.course as course, count(*) as n
    from   Classes c join Attends a on a.class_id = c.id
    group  by c.id, c.course
)
select course, count(*), round(avg(n), 1)
from   sizes
group  by course
having avg(n) > (select avg(n) from sizes)
order  by avg(n) desc, course
;
