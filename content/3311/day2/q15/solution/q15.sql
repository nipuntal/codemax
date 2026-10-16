-- Question 15 -- sample answer

drop function if exists q15(integer, text);
create or replace function
    q15(_room integer, _day text) returns setof text
as $$
declare
    m  Rooms;
    r  record;
    n  integer := 0;
begin
    select * into m from Rooms where id = _room;
    if not found then
        return next 'No such room';
        return;
    end if;

    for r in
        select   c.start_time as s, c.end_time as e, c.course as co,
                 c.ctype as t,
                 (select count(*) from Attends a where a.class_id = c.id) as nstu
        from     Classes c
        where    c.held_in = _room and c.day_of_week::text = _day
        order by c.start_time, c.course
    loop
        n := n + 1;
        return next r.s || '-' || r.e || ' ' || r.co || ' ' || r.t
                    || ' (' || r.nstu || ' students)';
    end loop;

    if n = 0 then
        return next 'Nothing in ' || m.name || ' on ' || _day;
    end if;
    return;
end;
$$ language plpgsql;
