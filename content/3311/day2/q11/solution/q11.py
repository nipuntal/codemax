#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 11
Rooms of a given type, with class counts.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} 'Room Type'"
db = None


def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    rtype = sys.argv[1]

    cur = db.cursor()
    cur.execute("select unnest(enum_range(null::RoomType))::text")
    valid = [r[0] for r in cur.fetchall()]
    if rtype not in valid:
        print("No such room type")
        return

    cur.execute("""
        select   m.name, m.capacity, count(c.id)
        from     Rooms m left join Classes c on c.held_in = m.id
        where    m.rtype = %s
        group by m.id, m.name, m.capacity
        order by m.name
    """, [rtype])
    rows = cur.fetchall()
    for (name, cap, n) in rows:
        print(f"{name:<20} {cap:>3}  {n:>4}")
    print(f"{len(rows)} {rtype} rooms")


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
