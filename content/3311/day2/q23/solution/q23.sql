-- Question 23 -- sample answer

drop view if exists q23 cascade;
drop view if exists q23load cascade;

create view q23load(room, hours, nclasses)
as
select held_in, sum(end_time - start_time), count(*)
from   Classes
group  by held_in
;

create view q23(room, rtype, capacity, hours, nclasses)
as
select m.name, m.rtype, m.capacity, l.hours, l.nclasses
from   q23load l join Rooms m on l.room = m.id
where  l.hours = (select max(hours) from q23load)
order  by m.name
;
