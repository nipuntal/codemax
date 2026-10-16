-- Question 28 -- sample answer

drop function if exists q28(text);
create or replace function
    q28(_course text) returns setof text
as $$
declare
    r         record;
    n         integer := 0;
    pct       numeric;
    bestpct   numeric := -1;
    bestroom  text;
begin
    for r in
        select   c.day_of_week as d, c.start_time as s, c.end_time as e,
                 c.ctype as t, m.name as room, m.capacity as cap,
                 (select count(*) from Attends a where a.class_id = c.id) as nstu
        from     Classes c join Rooms m on c.held_in = m.id
        where    c.course = _course
        order by c.day_of_week, c.start_time, m.name
    loop
        n := n + 1;
        pct := round(r.nstu * 100.0 / r.cap, 1);
        return next r.d || ' ' || r.s || '-' || r.e || ' ' || r.t || ' '
                    || r.room || ' ' || r.nstu || '/' || r.cap
                    || ' (' || pct || '%)';
        if pct > bestpct then
            bestpct  := pct;
            bestroom := r.room;
        end if;
    end loop;

    if n = 0 then
        return next 'No such course';
        return;
    end if;

    return next 'Fullest: ' || bestroom || ' at ' || bestpct || '%';
    return;
end;
$$ language plpgsql;
