-- Question 19 -- sample answer

drop function if exists q19(integer);
create or replace function
    q19(_student integer) returns setof text
as $$
declare
    s  Students;
    r  record;
    n  integer := 0;
begin
    select * into s from Students where id = _student;
    if not found then
        return next 'No such student';
        return;
    end if;

    for r in
        select   c1.day_of_week as d,
                 c1.course as co1, c1.ctype as t1,
                 c1.start_time as s1, c1.end_time as e1,
                 c2.course as co2, c2.ctype as t2,
                 c2.start_time as s2, c2.end_time as e2
        from     Attends a1
                 join Attends a2 on a1.student_id = a2.student_id
                                and a1.class_id  < a2.class_id
                 join Classes c1 on a1.class_id = c1.id
                 join Classes c2 on a2.class_id = c2.id
        where    a1.student_id = _student
          and    c1.day_of_week = c2.day_of_week
          and    c1.start_time  < c2.end_time
          and    c2.start_time  < c1.end_time
        order by c1.day_of_week, c1.start_time, c2.start_time
    loop
        n := n + 1;
        return next r.d || ': ' || r.co1 || ' ' || r.t1 || ' '
                    || r.s1 || '-' || r.e1 || ' clashes with '
                    || r.co2 || ' ' || r.t2 || ' ' || r.s2 || '-' || r.e2;
    end loop;

    if n = 0 then
        return next 'No clashes';
    end if;
    return;
end;
$$ language plpgsql;
