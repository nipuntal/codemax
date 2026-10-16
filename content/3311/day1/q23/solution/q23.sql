-- Module 23 -- sample answer

drop function if exists q23(text);
create or replace function
    q23(_table text) returns integer
as $$
declare
    n integer;
begin
    execute 'select count(*) from ' || quote_ident(lower(_table)) into n;
    return n;
exception
    when others then
        return -1;
end;
$$ language plpgsql;
