-- Question 05 -- sample answer

drop function if exists q05(integer);
create or replace function
    q05(_id integer) returns text
as $$
declare
    r Rooms;
begin
    select * into r from Rooms where id = _id;
    if not found then
        return 'No such room';
    end if;
    return r.name || ' (' || r.rtype || ', capacity ' || r.capacity || ')';
end;
$$ language plpgsql;
