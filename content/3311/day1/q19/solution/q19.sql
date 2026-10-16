-- Module 19 -- sample answer

drop function if exists q19(integer);
create or replace function
    q19(_capacity integer) returns text
as $$
begin
    if _capacity is null then
        return 'unknown';
    elsif _capacity < 30 then
        return 'small';
    elsif _capacity < 100 then
        return 'medium';
    else
        return 'large';
    end if;
end;
$$ language plpgsql;
