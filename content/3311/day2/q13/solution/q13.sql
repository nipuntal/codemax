-- Question 13 -- sample answer

drop view if exists q13 cascade;
create view q13(room, rtype, capacity, nclasses)
as
select m.name, m.rtype, m.capacity, count(c.id)
from   Rooms m left join Classes c on c.held_in = m.id
where  m.capacity = (select max(capacity) from Rooms)
group  by m.id, m.name, m.rtype, m.capacity
order  by m.name
;
