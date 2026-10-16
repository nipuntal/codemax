-- Question 37 -- sample answer

drop function if exists q37(integer);
create or replace function
    q37(_room integer) returns setof text
as $$
declare
    m   Rooms;
    r   record;
    n   integer;
    nc  integer;
    hrs integer;
    bd  text;
    bn  integer;
begin
    select * into m from Rooms where id = _room;
    if not found then
        return next 'No such room';
        return;
    end if;

    return next m.name || ' (' || m.rtype || ', capacity ' || m.capacity || ')';

    -- ---- facilities ----
    return next 'Facilities:';
    n := 0;
    for r in
        select   f.name
        from     Has h join Facilities f on h.facility_id = f.id
        where    h.room_id = _room
        order by f.name
    loop
        n := n + 1;
        return next '  - ' || r.name;
    end loop;
    if n = 0 then return next '  - none'; end if;

    -- ---- usage ----
    return next 'Usage:';
    select count(*), coalesce(sum(end_time - start_time), 0)
      into nc, hrs
    from   Classes where held_in = _room;

    if nc = 0 then
        return next '  - no classes scheduled';
    else
        select day_of_week::text, cnt into bd, bn
        from   (select day_of_week, count(*) as cnt
                from   Classes where held_in = _room
                group  by day_of_week
                order  by count(*) desc, day_of_week
                limit  1) t;
        return next '  - ' || nc || ' classes, ' || hrs || ' hours, busiest day '
                    || bd || ' with ' || bn || ' classes';
    end if;

    -- ---- clashes ----
    return next 'Clashes:';
    n := 0;
    for r in
        select   a.day_of_week as d, a.start_time as s1, a.end_time as e1,
                 b.start_time as s2, b.end_time as e2
        from     Classes a join Classes b
                   on a.held_in = b.held_in and a.id < b.id
        where    a.held_in = _room
          and    a.day_of_week = b.day_of_week
          and    a.start_time  < b.end_time
          and    b.start_time  < a.end_time
        order by a.day_of_week, a.start_time, b.start_time
    loop
        n := n + 1;
        return next '  - ' || r.d || ' ' || r.s1 || '-' || r.e1
                    || ' vs ' || r.s2 || '-' || r.e2;
    end loop;
    if n = 0 then return next '  - none'; end if;

    return;
end;
$$ language plpgsql;
