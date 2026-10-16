#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 27
Would these two courses clash?
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} Course1 Course2"
db = None


def main():
    if len(sys.argv) != 3:
        print(USAGE)
        return
    c1, c2 = sys.argv[1], sys.argv[2]

    if c1 == c2:
        print("Same course")
        return

    cur = db.cursor()
    for code in (c1, c2):
        cur.execute("select count(*) from Classes where course = %s", [code])
        if cur.fetchone()[0] == 0:
            print(f"No such course: {code}")
            return

    print(f"{c1} and {c2}")

    cur.execute("""
        select count(*) from (
            (select a.student_id from Attends a join Classes c on a.class_id=c.id
             where c.course = %s)
            intersect
            (select a.student_id from Attends a join Classes c on a.class_id=c.id
             where c.course = %s)
        ) t
    """, [c1, c2])
    print(f"- {cur.fetchone()[0]} students take both")

    cur.execute("""
        select   x.day_of_week, x.start_time, x.end_time, x.ctype, mx.name,
                 y.start_time, y.end_time, y.ctype, my.name
        from     Classes x join Classes y
                   on x.day_of_week = y.day_of_week
                  and x.start_time  < y.end_time
                  and y.start_time  < x.end_time
                 join Rooms mx on x.held_in = mx.id
                 join Rooms my on y.held_in = my.id
        where    x.course = %s and y.course = %s
        order by x.day_of_week, x.start_time, y.start_time, mx.name, my.name
    """, [c1, c2])
    rows = cur.fetchall()
    for (day, s1, e1, t1, r1, s2, e2, t2, r2) in rows:
        print(f"- {day} {s1}-{e1} {c1} {t1} {r1} vs {day} {s2}-{e2} {c2} {t2} {r2}")
    print(f"- {len(rows)} clashing pairs")


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
