#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 38
A room's day, bookings and gaps.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} RoomName Day"
db = None


def main():
    if len(sys.argv) != 3:
        print(USAGE)
        return
    room, day = sys.argv[1], sys.argv[2]

    cur = db.cursor()
    cur.execute("select id, name from Rooms where name = %s", [room])
    row = cur.fetchone()
    if row is None:
        print(f"No such room: {room}")
        return
    rid = row[0]

    cur.execute("select unnest(enum_range(null::Weekday))::text")
    if day not in [r[0] for r in cur.fetchall()]:
        print(f"No such day: {day}")
        return

    cur.execute("""
        select   start_time, end_time, course, ctype
        from     Classes
        where    held_in = %s and day_of_week::text = %s
        order by course, start_time
    """, [rid, day])
    classes = cur.fetchall()

    # label every hour 9..20
    label = {}
    for (st, en, course, ctype) in classes:
        for h in range(st, en):
            label.setdefault(h, f"{course.strip()} {ctype}")

    print(f"{room} {day}")
    booked = 0
    h = 9
    while h < 21:
        what = label.get(h)
        j = h
        while j < 21 and label.get(j) == what:
            j += 1
        if what is None:
            print(f"{h:02}-{j:02} FREE ({j - h} hours)")
        else:
            print(f"{h:02}-{j:02} {what}")
            booked += j - h
        h = j
    print(f"Booked {booked} hours, free {12 - booked} hours between 9 and 21")


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
