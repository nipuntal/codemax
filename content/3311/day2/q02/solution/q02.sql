-- Question 02 -- sample answer

drop view if exists q02 cascade;
create view q02(room, capacity)
as
select name, capacity
from   Rooms
where  rtype = 'Computer Lab'
order  by capacity desc, name
;
