-- Question 35 -- sample answer

drop view if exists q35 cascade;
create view q35(room, capacity, nfacilities, nsubs)
as
select a.name,
       a.capacity,
       (select count(*) from Has h where h.room_id = a.id),
       (select count(*)
        from   Rooms b
        where  b.id <> a.id
          and  b.capacity >= a.capacity
          and  not exists (
                   select 1 from Has ha
                   where  ha.room_id = a.id
                     and  not exists (
                              select 1 from Has hb
                              where  hb.room_id     = b.id
                                and  hb.facility_id = ha.facility_id
                          )
               ))
from   Rooms a
where  a.rtype = 'Lecture Theatre'
order  by 4 desc, a.name
;
