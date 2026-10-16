-- Module 18 -- sample answer

drop view if exists q18 cascade;
create view q18(rtype, nrooms, small, medium, large, avg_seats)
as
select rtype,
       count(*),
       count(*) filter (where capacity < 30),
       count(*) filter (where capacity between 30 and 99),
       count(*) filter (where capacity >= 100),
       round(avg(capacity), 1)
from   Rooms
group  by rtype
order  by count(*) desc, rtype
;
