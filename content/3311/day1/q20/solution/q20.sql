-- Module 20 -- sample answer

drop function if exists q20(integer);
create or replace function
    q20(_room integer) returns text
as $$
declare
    r      Rooms;
    n      integer;
    hours  integer;
    head   text;
begin
    select * into r from Rooms where id = _room;
    if not found then
        return 'No such room';
    end if;

    head := r.name || ' (' || r.rtype || ', ' || r.capacity || ' seats)';

    select count(*), coalesce(sum(end_time - start_time), 0)
      into n, hours
    from   Classes where held_in = _room;

    if n = 0 then
        return head || ': no classes';
    end if;
    return head || ': ' || n || ' classes, ' || hours || ' hours';
end;
$$ language plpgsql;
