#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 30
Report on one room, by id.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} RoomID"
db = None


### Main part of script
def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    try:
        rid = int(sys.argv[1])
    except ValueError:
        print(USAGE)
        return

    cur = db.cursor()
    cur.execute("select name, rtype, capacity from Rooms where id = %s", [rid])
    row = cur.fetchone()
    if row is None:
        print(f"No such room: {rid}")
        return
    (name, rtype, cap) = row
    print(f"{name} ({rtype}, {cap} seats)")

    cur.execute("""select count(*), coalesce(sum(end_time - start_time), 0)
                   from Classes where held_in = %s""", [rid])
    (n, hours) = cur.fetchone()
    if n == 0:
        print("  no classes")
        return
    print(f"  {n} classes, {hours} hours")

    cur.execute("""
        select   day_of_week, count(*)
        from     Classes
        where    held_in = %s
        group by day_of_week
        order by count(*) desc, day_of_week
        limit    1
    """, [rid])
    (day, dn) = cur.fetchone()
    print(f"  busiest day: {day} with {dn} classes")


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
