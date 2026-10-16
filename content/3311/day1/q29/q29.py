#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 29
A formatted table of rooms of one type.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} 'Room Type'"
db = None


### Main part of script
def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    rtype = sys.argv[1]

    ### YOUR CODE HERE
    pass


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
