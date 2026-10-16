-- Module 00 -- sample answer

drop view if exists q00 cascade;
create view q00(students, rooms, classes)
as
select (select count(*) from Students),
       (select count(*) from Rooms),
       (select count(*) from Classes)
;
