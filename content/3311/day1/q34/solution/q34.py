#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 34
Record a facility in a room.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} RoomID 'Facility' Count"
db = None


### Main part of script
def main():
    if len(sys.argv) != 4:
        print(USAGE)
        return
    try:
        rid = int(sys.argv[1])
        nitems = int(sys.argv[3])
    except ValueError:
        print(USAGE)
        return
    fname = sys.argv[2]

    cur = db.cursor()
    cur.execute("select name from Rooms where id = %s", [rid])
    row = cur.fetchone()
    if row is None:
        print(f"no such room: {rid}")
        return
    room = row[0]

    cur.execute("select id from Facilities where name = %s", [fname])
    row = cur.fetchone()
    if row is None:
        print(f"no such facility: {fname}")
        return
    fid = row[0]

    cur.execute("select 1 from Has where room_id = %s and facility_id = %s",
                [rid, fid])
    if cur.fetchone() is not None:
        print(f"{room} already has {fname}")
        return

    try:
        cur.execute("""insert into Has (room_id, facility_id, nitems)
                       values (%s, %s, %s)""", [rid, fid, nitems])
        db.commit()
    except psycopg2.Error:
        db.rollback()
        print("could not add it")
        return

    print(f"added {fname} x{nitems} to {room}")


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
