#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 33
Build a helper view, then use it.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} MinRooms"
db = None


### Main part of script
def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    try:
        least = int(sys.argv[1])
    except ValueError:
        print(USAGE)
        return

    cur = db.cursor()
    cur.execute("""
        create or replace view q33helper(course, nrooms, nclasses) as
        select course, count(distinct held_in), count(*)
        from   Classes
        group  by course
    """)

    print(f"courses using at least {least} rooms:")

    cur.execute("""
        select   course, nrooms, nclasses
        from     q33helper
        where    nrooms >= %s
        order by nrooms desc, course
    """, [least])
    rows = cur.fetchall()
    for (course, nrooms, nclasses) in rows:
        print(f"{course} uses {nrooms} rooms for {nclasses} classes")

    cur.execute("select count(*) from q33helper")
    total = cur.fetchone()[0]
    print(f"{len(rows)} courses qualify, out of {total}")


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
