-- Module 05 -- sample answer

drop view if exists q05 cascade;
create view q05(room, label)
as
select name,
       coalesce(name, 'unknown')
       || ' (' || coalesce(rtype::text, 'unknown')
       || ', seats ' || coalesce(capacity::text, '0') || ')'
from   Rooms
;
