-- Question 10 -- sample answer

drop function if exists q10(text);
create or replace function
    q10(_course text) returns setof text
as $$
declare
    r  record;
    n  integer := 0;
begin
    for r in
        select   c.day_of_week as d, c.start_time as s, c.end_time as e,
                 c.ctype as t, m.name as room
        from     Classes c join Rooms m on c.held_in = m.id
        where    c.course = _course
        order by c.day_of_week, c.start_time, m.name
    loop
        n := n + 1;
        return next r.d || ' ' || r.s || '-' || r.e || ' ' || r.t
                    || ' in ' || r.room;
    end loop;

    if n = 0 then
        return next 'No such course';
    end if;
    return;
end;
$$ language plpgsql;
