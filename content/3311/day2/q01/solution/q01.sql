-- Question 01 -- sample answer

drop view if exists q01 cascade;
create view q01(rtype, nrooms, smallest, largest)
as
select rtype, count(*), min(capacity), max(capacity)
from   Rooms
group  by rtype
order  by rtype
;
