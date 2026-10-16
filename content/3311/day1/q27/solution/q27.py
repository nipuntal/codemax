#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 27
A one-screen summary of the database.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} "
db = None


### Main part of script
def main():
    if len(sys.argv) != 1:
        print(USAGE)
        return

    cur = db.cursor()
    cur.execute("""
        select (select count(*) from Students),
               (select count(*) from Rooms),
               (select count(*) from Classes)
    """)
    (ns, nr, nc) = cur.fetchone()
    print(f"{ns} students, {nr} rooms, {nc} classes")

    cur.execute("""
        select (select count(*) from Attends),
               (select count(distinct course) from Classes)
    """)
    (na, ncourse) = cur.fetchone()
    print(f"{na} enrolments across {ncourse} courses")

    cur.execute("""
        select   r.name, count(*)
        from     Classes c join Rooms r on c.held_in = r.id
        group by r.id, r.name
        order by count(*) desc, r.name
        limit    1
    """)
    (room, n) = cur.fetchone()
    print(f"busiest room: {room} with {n} classes")


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
