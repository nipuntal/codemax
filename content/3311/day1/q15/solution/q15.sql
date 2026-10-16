-- Module 15 -- sample answer

drop view if exists q15 cascade;
create view q15(room, usage)
as
    (select r.name, 'both'
     from   Rooms r
     where  exists (select 1 from Classes c where c.held_in=r.id and c.ctype='Lecture')
       and  exists (select 1 from Classes c where c.held_in=r.id and c.ctype='Tutorial'))
union
    (select r.name, 'lectures only'
     from   Rooms r
     where  exists     (select 1 from Classes c where c.held_in=r.id and c.ctype='Lecture')
       and  not exists (select 1 from Classes c where c.held_in=r.id and c.ctype='Tutorial'))
union
    (select r.name, 'tutorials only'
     from   Rooms r
     where  not exists (select 1 from Classes c where c.held_in=r.id and c.ctype='Lecture')
       and  exists     (select 1 from Classes c where c.held_in=r.id and c.ctype='Tutorial'))
order  by 2, 1
;
