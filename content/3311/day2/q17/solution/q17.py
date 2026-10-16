#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 17
Find one room by partial name, show one day.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} RoomPattern Day"
db = None


def main():
    if len(sys.argv) != 3:
        print(USAGE)
        return
    pat, day = sys.argv[1], sys.argv[2]

    cur = db.cursor()
    cur.execute("""select id, name, rtype, capacity from Rooms
                   where name ilike %s order by id""", ['%' + pat + '%'])
    rows = cur.fetchall()
    if len(rows) == 0:
        print("No matching room")
        return
    if len(rows) > 1:
        print("Room is ambiguous")
        return

    (rid, name, rtype, cap) = rows[0]
    print(f"{name} ({rtype}, capacity {cap})")

    cur.execute("""
        select   start_time, end_time, course, ctype
        from     Classes
        where    held_in = %s and day_of_week::text = %s
        order by start_time, course
    """, [rid, day])
    classes = cur.fetchall()
    if not classes:
        print("  nothing scheduled")
        return
    for (st, en, course, ct) in classes:
        print(f"  {st}-{en} {course} {ct}")


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
