-- Module 21 -- sample answer

drop function if exists q21(integer, text);
create or replace function
    q21(_room integer, _day text) returns text
as $$
declare
    r    Rooms;
    t    record;
    out  text := '';
begin
    select * into r from Rooms where id = _room;
    if not found then
        return 'No such room';
    end if;

    for t in
        select   course, start_time, end_time
        from     Classes
        where    held_in = _room and day_of_week::text = _day
        order by start_time, course
    loop
        if out = '' then
            out := t.course || ' ' || t.start_time || '-' || t.end_time;
        else
            out := out || ', ' || t.course || ' '
                       || t.start_time || '-' || t.end_time;
        end if;
    end loop;

    if out = '' then
        return r.name || ': nothing on ' || _day;
    end if;
    return r.name || ': ' || out;
end;
$$ language plpgsql;
