#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 22
How many of a course's students have a clash.
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
    cur.execute("select count(*) from Classes where course = %s", [course])
    if cur.fetchone()[0] == 0:
        print("No such course")
        return

    cur.execute("""
        with enrolled as (
            select distinct a.student_id as sid
            from   Attends a join Classes c on a.class_id = c.id
            where  c.course = %s
        )
        select count(*),
               count(*) filter (where exists (
                   select 1
                   from   Attends x
                          join Attends y on x.student_id = y.student_id
                                        and x.class_id  < y.class_id
                          join Classes c1 on x.class_id = c1.id
                          join Classes c2 on y.class_id = c2.id
                   where  x.student_id     = e.sid
                     and  c1.day_of_week   = c2.day_of_week
                     and  c1.start_time    < c2.end_time
                     and  c2.start_time    < c1.end_time
               ))
        from   enrolled e
    """, [course])
    (n, m) = cur.fetchone()

    if n == 0:
        print(f"{course}: no students")
        return
    pct = m / n * 100
    print(f"{course}: {n} students, {m} with a clash ({pct:.1f}%)")


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
