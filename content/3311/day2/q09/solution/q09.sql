-- Question 09 -- sample answer

drop view if exists q09 cascade;
create view q09(id, name)
as
select s.id, s.name
from   Students s
where  not exists (select 1 from Attends a where a.student_id = s.id)
order  by s.name, s.id
;
