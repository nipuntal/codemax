#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 35
Search rooms with optional filters.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} [type T] [min N] [max N] [like S]"
db = None


### Main part of script
def main():
    rest = sys.argv[1:]
    if len(rest) % 2 != 0:
        print(USAGE)
        return

    conds = ["true"]
    args = []
    i = 0
    while i < len(rest):
        key, val = rest[i], rest[i + 1]
        if key == "type":
            conds.append("rtype::text = %s")
            args.append(val)
        elif key == "min":
            conds.append("capacity >= %s")
            args.append(val)
        elif key == "max":
            conds.append("capacity <= %s")
            args.append(val)
        elif key == "like":
            conds.append("name ilike %s")
            args.append("%" + val + "%")
        else:
            print(USAGE)
            return
        i += 2

    query = ("select name, rtype, capacity from Rooms where "
             + " and ".join(conds) + " order by name")
    cur = db.cursor()
    cur.execute(query, args)
    for (name, rtype, cap) in cur.fetchall():
        print(f"{name}|{rtype}|{cap}")


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
