-- Question 26 -- sample answer

drop view if exists q26 cascade;
drop view if exists q26rooms cascade;

create view q26rooms(id, building, capacity)
as
select id,
       case when name like '%-%' then split_part(name, '-', 1)
            else '(none)' end,
       capacity
from   Rooms
;

create view q26(building, nrooms, seats, nclasses, hours)
as
with per_building as (
    select building, count(*) as nrooms, sum(capacity) as seats
    from   q26rooms
    group  by building
),
per_use as (
    select b.building,
           count(c.id) as nclasses,
           coalesce(sum(c.end_time - c.start_time), 0) as hours
    from   q26rooms b left join Classes c on c.held_in = b.id
    group  by b.building
)
select p.building, p.nrooms, p.seats, u.nclasses, u.hours
from   per_building p join per_use u on p.building = u.building
where  p.nrooms >= 5
order  by u.hours desc, p.building
;
