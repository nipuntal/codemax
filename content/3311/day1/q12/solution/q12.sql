-- Module 12 -- sample answer

drop view if exists q12 cascade;
create view q12(room, rtype, capacity, nfacilities, nitems)
as
select r.name,
       r.rtype,
       r.capacity,
       count(h.facility_id),
       coalesce(sum(h.nitems), 0)
from   Rooms r left join Has h on h.room_id = r.id
group  by r.id, r.name, r.rtype, r.capacity
order  by count(h.facility_id) desc, r.name
;
