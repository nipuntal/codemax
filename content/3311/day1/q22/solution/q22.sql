-- Module 22 -- sample answer

drop function if exists q22(text);
create or replace function
    q22(_course text) returns setof text
as $$
declare
    t  record;
    n  integer := 0;
begin
    for t in
        select   c.day_of_week as d, c.start_time as s, c.end_time as e,
                 c.ctype as ct, r.name as room, r.capacity as cap
        from     Classes c join Rooms r on c.held_in = r.id
        where    c.course = _course
        order by c.day_of_week, c.start_time, r.name
    loop
        n := n + 1;
        return next t.d || ' ' || t.s || '-' || t.e || ' ' || t.ct
                    || ' in ' || t.room || ' (' || t.cap || ' seats)';
    end loop;

    if n = 0 then
        return next 'No such course';
    end if;
    return;
end;
$$ language plpgsql;
