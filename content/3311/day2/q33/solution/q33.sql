-- Question 33 -- sample answer

drop function if exists q33(integer);
create or replace function
    q33(_student integer) returns setof text
as $$
declare
    s     Students;
    k     record;
    alt   record;
    n     integer := 0;
    nalt  integer;
begin
    select * into s from Students where id = _student;
    if not found then
        return next 'No such student';
        return;
    end if;

    for k in
        select   c.id, c.course, c.ctype, c.day_of_week as d,
                 c.start_time as st, c.end_time as en
        from     Attends a join Classes c on a.class_id = c.id
        where    a.student_id = _student
          and    exists (
                     select 1 from Attends a2 join Classes c2 on a2.class_id = c2.id
                     where  a2.student_id = _student
                       and  c2.id <> c.id
                       and  c2.day_of_week = c.day_of_week
                       and  c2.start_time  < c.end_time
                       and  c.start_time   < c2.end_time
                 )
        order by c.day_of_week, c.start_time, c.course
    loop
        n := n + 1;
        return next k.course || ' ' || k.ctype || ' ' || k.d || ' '
                    || k.st || '-' || k.en || ' clashes';

        nalt := 0;
        for alt in
            select   c.day_of_week as d, c.start_time as st,
                     c.end_time as en, m.name as room
            from     Classes c join Rooms m on c.held_in = m.id
            where    c.course = k.course
              and    c.ctype  = k.ctype
              and    c.id    <> k.id
              and    not exists (
                         select 1
                         from   Attends a3 join Classes c3 on a3.class_id = c3.id
                         where  a3.student_id = _student
                           and  c3.id <> k.id
                           and  c3.day_of_week = c.day_of_week
                           and  c3.start_time  < c.end_time
                           and  c.start_time   < c3.end_time
                     )
            order by c.day_of_week, c.start_time, m.name
        loop
            nalt := nalt + 1;
            return next '  -> move to ' || alt.d || ' ' || alt.st || '-'
                        || alt.en || ' in ' || alt.room;
        end loop;

        if nalt = 0 then
            return next '  -> no alternative offering';
        end if;
    end loop;

    if n = 0 then
        return next 'No clashes';
    end if;
    return;
end;
$$ language plpgsql;
