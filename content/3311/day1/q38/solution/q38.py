#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 38
One student's weekly timetable.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} 'Student Name'"
db = None


### Main part of script
def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    name = sys.argv[1]

    cur = db.cursor()
    cur.execute("select id, name from Students where name = %s order by id",
                [name])
    found = cur.fetchall()
    if len(found) == 0:
        print("No such student")
        return
    if len(found) > 1:
        print(f"Ambiguous: {len(found)} students named {name}")
        return

    (sid, sname) = found[0]
    print(f"{sname} ({sid})")

    cur.execute("""
        select   c.day_of_week, c.start_time, c.end_time,
                 c.course, c.ctype, r.name
        from     Attends a
                 join Classes c on a.class_id = c.id
                 join Rooms   r on c.held_in  = r.id
        where    a.student_id = %s
        order by c.day_of_week, c.start_time, c.course
    """, [sid])
    rows = cur.fetchall()

    hours = 0
    for (day, st, en, course, ctype, room) in rows:
        hours += en - st
        span = f"{st}-{en}"
        what = f"{course} {ctype}"
        print(f"{day} {span:<6} {what:<20} in {room}")

    print(f"{len(rows)} classes, {hours} hours")


### Driver to invoke main code
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
