#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 40
Rooms with a given facility, and how used they are.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} 'Facility'"
db = None


### Main part of script
def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    fname = sys.argv[1]

    cur = db.cursor()
    cur.execute("select id from Facilities where name = %s", [fname])
    row = cur.fetchone()
    if row is None:
        print(f"No such facility: {fname}")
        return
    fid = row[0]

    cur.execute("""
        select   r.name, r.rtype, r.capacity,
                 count(c.id),
                 coalesce(sum(c.end_time - c.start_time), 0)
        from     Has h
                 join Rooms r on h.room_id = r.id
                 left join Classes c on c.held_in = r.id
        where    h.facility_id = %s
        group by r.id, r.name, r.rtype, r.capacity
        order by count(c.id) desc, r.name
    """, [fid])
    rows = cur.fetchall()

    print(f"{fname} is in {len(rows)} rooms")
    tot_c = 0
    tot_h = 0
    for (name, rtype, cap, n, hours) in rows:
        tot_c += n
        tot_h += hours
        print(f"{name:<20} {rtype:<15} {cap:>4}  {n:>3} classes  {hours:>3} hours")
    print(f"totals: {len(rows)} rooms, {tot_c} classes, {tot_h} hours")


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
