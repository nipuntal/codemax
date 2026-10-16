-- Question 21 -- sample answer

drop view if exists q21 cascade;
drop view if exists q21equipped cascade;

-- rooms that have a video data projector
create view q21equipped(room)
as
select h.room_id
from   Has h join Facilities f on h.facility_id = f.id
where  f.name = 'Video data projector'
;

create view q21(course, nclasses, nrooms)
as
select c.course, count(*), count(distinct c.held_in)
from   Classes c
group  by c.course
having count(*) = count(*) filter (where c.held_in in (select room from q21equipped))
order  by c.course
;
