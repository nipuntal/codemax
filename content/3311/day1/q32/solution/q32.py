#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 32
Courses grouped by how many rooms they use.
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
        select   count(distinct held_in) as nrooms, course, count(*) as nclasses
        from     Classes
        group by course
        order by count(distinct held_in), course
    """)

    previous = None
    for (nrooms, course, nclasses) in cur.fetchall():
        if nrooms != previous:
            print(f"{nrooms} room" if nrooms == 1 else f"{nrooms} rooms")
            previous = nrooms
        print(f"- {course}: {nclasses} classes")


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
