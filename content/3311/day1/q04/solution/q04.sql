-- Module 04 -- sample answer

drop view if exists q04 cascade;
create view q04(room, rtype, capacity)
as
select name, rtype, capacity
from   Rooms
where  name like 'EE-%'
;
