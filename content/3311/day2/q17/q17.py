#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 17
Find one room by partial name, show one day.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} RoomPattern Day"
db = None


def main():
    if len(sys.argv) != 3:
        print(USAGE)
        return
    pat, day = sys.argv[1], sys.argv[2]

    ### YOUR CODE HERE
    pass


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
