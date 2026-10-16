-- Module 07 -- sample answer

drop view if exists q07 cascade;
create view q07(nrooms, ntypes, smallest, biggest, total_seats, avg_seats)
as
select count(*),
       count(distinct rtype),
       min(capacity),
       max(capacity),
       sum(capacity),
       round(avg(capacity), 1)
from   Rooms
;
