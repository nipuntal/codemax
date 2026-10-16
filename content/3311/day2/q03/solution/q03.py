#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 03
One-line summary of the database.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} "
db = None


def main():
    if len(sys.argv) != 1:
        print(USAGE)
        return

    cur = db.cursor()
    cur.execute("""
        select (select count(*) from Students),
               (select count(*) from Rooms),
               (select count(*) from Classes),
               (select count(*) from Attends)
    """)
    (ns, nr, nc, na) = cur.fetchone()
    print(f"{ns} students, {nr} rooms, {nc} classes, {na} enrolments")


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
