#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 36
A one-screen report on a course.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} CourseCode"
db = None


def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    course = sys.argv[1]

    cur = db.cursor()
    cur.execute("""select count(*), count(distinct day_of_week),
                          count(distinct held_in)
                   from Classes where course = %s""", [course])
    (nclasses, ndays, nrooms) = cur.fetchone()
    if nclasses == 0:
        print("No such course")
        return
    print(course)
    print(f"  {'classes:':<12}{nclasses} across {ndays} days in {nrooms} rooms")

    cur.execute("""select count(distinct a.student_id), count(*)
                   from   Attends a join Classes c on a.class_id = c.id
                   where  c.course = %s""", [course])
    (nstu, nenrol) = cur.fetchone()
    avg = nenrol / nstu if nstu else 0
    print(f"  {'students:':<12}{nstu} enrolled, {avg:.1f} classes each on average")

    cur.execute("""
        select   c.ctype, c.day_of_week, c.start_time, c.end_time, m.name,
                 round(count(a.student_id) * 100.0 / m.capacity, 1)
        from     Classes c join Rooms m on c.held_in = m.id
                 left join Attends a on a.class_id = c.id
        where    c.course = %s
        group by c.id, c.ctype, c.day_of_week, c.start_time, c.end_time,
                 m.name, m.capacity
        order by 6 desc, c.day_of_week, c.start_time
        limit    1
    """, [course])
    (ct, day, st, en, room, pct) = cur.fetchone()
    print(f"  {'fullest:':<12}{course} {ct} {day} {st}-{en} in {room} at {pct}%")

    cur.execute("""select count(*)
                   from   Classes c join Rooms m on c.held_in = m.id
                   where  c.course = %s
                     and  c.ctype in ('Lab Class','Tute-Lab')
                     and  m.rtype <> 'Computer Lab'""", [course])
    print(f"  {'wrong room:':<12}{cur.fetchone()[0]} lab classes not in a Computer Lab")

    cur.execute("""
        with enrolled as (
            select distinct a.student_id as sid
            from   Attends a join Classes c on a.class_id = c.id
            where  c.course = %s
        )
        select count(*) filter (where exists (
                   select 1 from Attends x
                          join Attends y on x.student_id = y.student_id
                                        and x.class_id  < y.class_id
                          join Classes c1 on x.class_id = c1.id
                          join Classes c2 on y.class_id = c2.id
                   where  x.student_id   = e.sid
                     and  c1.day_of_week = c2.day_of_week
                     and  c1.start_time  < c2.end_time
                     and  c2.start_time  < c1.end_time))
        from enrolled e
    """, [course])
    print(f"  {'clashes:':<12}{cur.fetchone()[0]} of {nstu} students have a timetable clash")


if __name__ == '__main__':
    try:
        db = psycopg2.connect(dbname="classes")
        main()
    except psycopg2.Error as err:
        print("DB error: ", err)
    except Exception as err:
        print("Internal Error: ", err)
        raise err
    finally:
        if db is not None:
            db.close()
    sys.exit(0)
