-- Module 01 -- sample answer

drop view if exists q01 cascade;
create view q01(facility)
as
select name from Facilities
;
