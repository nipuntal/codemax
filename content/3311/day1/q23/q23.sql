-- Module 23
-- Count the rows in any table; -1 if there is no such table.

drop function if exists q23(text);
create or replace function
    q23(_table text) returns integer
as $$
declare
    n integer;
begin
    -- YOUR ANSWER HERE

end;
$$ language plpgsql;
