#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 31
Run an SQL query and report on it.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} 'SQL query'"
db = None


### Main part of script
def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    query = sys.argv[1]

    cur = db.cursor()
    try:
        cur.execute(query)
        rows = cur.fetchall()
    except psycopg2.Error:
        db.rollback()
        print("query failed")
        return

    n = len(rows)
    print(f"{n} row" if n == 1 else f"{n} rows")
    for row in rows:
        print("|".join(str(v) for v in row))


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
