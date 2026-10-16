#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 14
One student's weekly timetable.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} 'Student Name'"
db = None


def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    name = sys.argv[1]

    cur = db.cursor()
    cur.execute("select id, name from Students where name = %s order by id", [name])
    rows = cur.fetchall()
    if len(rows) == 0:
        print("No such student")
        return
    if len(rows) > 1:
        print(f"Ambiguous: {len(rows)} students named {name}")
        return

    (sid, sname) = rows[0]
    print(f"{sname} ({sid})")

    cur.execute("""
        select   c.day_of_week, c.start_time, c.end_time,
                 c.course, c.ctype, m.name
        from     Attends a
                 join Classes c on a.class_id = c.id
                 join Rooms   m on c.held_in  = m.id
        where    a.student_id = %s
        order by c.day_of_week, c.start_time, c.course
    """, [sid])
    for (day, st, en, course, ct, room) in cur.fetchall():
        what = f"{course} {ct}"
        print(f"{day} {st}-{en}  {what:<22} in {room}")


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
