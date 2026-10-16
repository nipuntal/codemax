-- Module 24 -- sample answer

drop function if exists q24(integer);
create or replace function
    q24(_room integer) returns setof text
as $$
declare
    r        Rooms;
    t        record;
    head     text;
    n        integer;
    totc     integer := 0;
    toth     integer := 0;
begin
    select * into r from Rooms where id = _room;
    if not found then
        return next 'No such room';
        return;
    end if;

    head := r.name || ' (' || r.rtype || ', ' || r.capacity || ' seats)';

    select count(*) into n from Classes where held_in = _room;
    if n = 0 then
        return next head || ': no classes';
        return;
    end if;

    return next head;

    for t in
        select   day_of_week as d, count(*) as c,
                 sum(end_time - start_time) as h
        from     Classes
        where    held_in = _room
        group    by day_of_week
        order    by day_of_week
    loop
        totc := totc + t.c;
        toth := toth + t.h;
        return next '  ' || t.d || ': ' || t.c || ' classes, '
                    || t.h || ' hours';
    end loop;

    return next '  Total: ' || totc || ' classes, ' || toth || ' hours';
    return;
end;
$$ language plpgsql;
