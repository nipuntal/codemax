#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 25
Argument handling -- no database yet.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} Room [Day]"
db = None


### Main part of script
def main():
    if len(sys.argv) < 2 or len(sys.argv) > 3:
        print(USAGE)
        return

    room = sys.argv[1]
    if len(sys.argv) == 3:
        print(f"room {room} on {sys.argv[2]}")
    else:
        print(f"room {room}")
        print("no day given")


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
