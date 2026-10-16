#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 20
A course's week, day by day.
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
    cur.execute("""
        select   c.day_of_week::text, c.start_time, c.end_time, c.ctype,
                 m.name, count(a.student_id)
        from     Classes c
                 join Rooms m on c.held_in = m.id
                 left join Attends a on a.class_id = c.id
        where    c.course = %s
        group by c.id, c.day_of_week, c.start_time, c.end_time, c.ctype, m.name
        order by c.start_time, m.name
    """, [course])
    rows = cur.fetchall()
    if not rows:
        print("No such course")
        return

    from collections import defaultdict
    byday = defaultdict(list)
    for (day, st, en, ct, room, n) in rows:
        byday[day].append(f"- {st}-{en} {ct}, {room}, {n} students")

    print(course)
    for day in ("Mon", "Tue", "Wed", "Thu", "Fri"):
        print(day)
        if byday[day]:
            for line in byday[day]:
                print(line)
        else:
            print("- nothing on")


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
