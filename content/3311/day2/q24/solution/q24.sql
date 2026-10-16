-- Question 24 -- sample answer

drop function if exists q24(integer);
create or replace function
    q24(_room integer) returns setof text
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
        select   a.day_of_week as d,
                 a.start_time as s1, a.end_time as e1, a.course as c1,
                 b.start_time as s2, b.end_time as e2, b.course as c2
        from     Classes a join Classes b
                   on a.held_in = b.held_in and a.id < b.id
        where    a.held_in = _room
          and    a.day_of_week = b.day_of_week
          and    a.start_time  < b.end_time
          and    b.start_time  < a.end_time
        order by a.day_of_week, a.start_time, b.start_time
    loop
        n := n + 1;
        return next r.d || ' ' || r.s1 || '-' || r.e1 || ' ' || r.c1
                    || ' overlaps ' || r.s2 || '-' || r.e2 || ' ' || r.c2;
    end loop;

    if n = 0 then
        return next m.name || ' is never double-booked';
    end if;
    return;
end;
$$ language plpgsql;
