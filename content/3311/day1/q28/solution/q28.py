#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 28
Timetable for one course.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} CourseCode"
db = None


### Main part of script
def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    course = sys.argv[1]

    cur = db.cursor()
    cur.execute("""
        select   c.day_of_week, c.start_time, c.end_time, c.ctype, r.name
        from     Classes c join Rooms r on c.held_in = r.id
        where    c.course = %s
        order by c.day_of_week, c.start_time, r.name
    """, [course])
    rows = cur.fetchall()
    if not rows:
        print("No such course")
        return

    print(course)
    for (day, st, en, ct, room) in rows:
        print(f"{day} {st}-{en} {ct} in {room}")


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
