#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 39
A room's day, hour by hour.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} RoomText Day"
db = None


### Main part of script
def main():
    if len(sys.argv) != 3:
        print(USAGE)
        return
    text, day = sys.argv[1], sys.argv[2]

    cur = db.cursor()
    cur.execute("""select id, name, rtype, capacity from Rooms
                   where name ilike %s order by id""", ['%' + text + '%'])
    found = cur.fetchall()
    if len(found) == 0:
        print("No matching room")
        return
    if len(found) > 1:
        print(f"Ambiguous: {len(found)} rooms match {text}")
        return
    (rid, rname, rtype, cap) = found[0]

    cur.execute("select unnest(enum_range(null::Weekday))::text")
    if day not in [r[0] for r in cur.fetchall()]:
        print(f"No such day: {day}")
        return

    print(f"{rname} ({rtype}, {cap} seats) on {day}")

    cur.execute("""
        select   start_time, end_time, course, ctype
        from     Classes
        where    held_in = %s and day_of_week::text = %s
        order by course, start_time
    """, [rid, day])

    busy = {}
    for (st, en, course, ctype) in cur.fetchall():
        for h in range(st, en):
            busy.setdefault(h, f"{course.strip()} {ctype}")

    for h in range(9, 21):
        what = busy.get(h)
        print(f"{h:02} {what}" if what else f"{h:02} free")

    print(f"booked {len(busy)} of 12 hours")


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
