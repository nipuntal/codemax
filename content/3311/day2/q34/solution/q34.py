#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 34
A room's week as a grid.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} RoomName"
db = None


def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    room = sys.argv[1]

    DAYS = ("Mon", "Tue", "Wed", "Thu", "Fri")

    cur = db.cursor()
    cur.execute("select id, name, rtype, capacity from Rooms where name = %s",
                [room])
    row = cur.fetchone()
    if row is None:
        print(f"No such room: {room}")
        return
    (rid, name, rtype, cap) = row
    print(f"{name} ({rtype}, capacity {cap})")

    cur.execute("""
        select   c.day_of_week::text, h, c.course
        from     Classes c, generate_series(c.start_time, c.end_time - 1) as h
        where    c.held_in = %s
        order by c.course
    """, [rid])
    grid = {}
    for (day, hour, course) in cur.fetchall():
        grid.setdefault((day, hour), course.strip())

    print("     " + "".join(f"{d:<9}" for d in DAYS).rstrip())
    for hour in range(9, 21):
        cells = "".join(f"{grid.get((d, hour), '.'):<9}" for d in DAYS)
        print(f"{hour:>2}   {cells}".rstrip())


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
