#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 29
Rooms free in a given slot.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} Day Start End MinCapacity"
db = None


def main():
    if len(sys.argv) != 5:
        print(USAGE)
        return
    day = sys.argv[1]
    try:
        start = int(sys.argv[2])
        end = int(sys.argv[3])
        cap = int(sys.argv[4])
    except ValueError:
        print(USAGE)
        return

    cur = db.cursor()
    cur.execute("select unnest(enum_range(null::Weekday))::text")
    if day not in [r[0] for r in cur.fetchall()]:
        print(f"No such day: {day}")
        return
    if start >= end:
        print("Bad time range")
        return

    cur.execute("""
        select   m.name, m.rtype, m.capacity
        from     Rooms m
        where    m.capacity >= %s
          and    not exists (
                     select 1 from Classes c
                     where  c.held_in = m.id
                       and  c.day_of_week::text = %s
                       and  c.start_time < %s
                       and  %s < c.end_time
                 )
        order by m.capacity desc, m.name
    """, [cap, day, end, start])
    rows = cur.fetchall()

    print(f"{len(rows)} rooms free {day} {start}-{end} with capacity >= {cap}")
    for (name, rtype, capacity) in rows:
        print(f"{name:<20} {rtype:<20} {capacity:>5}")


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
