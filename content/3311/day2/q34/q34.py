#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 34
A room's week as a grid.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} RoomName"
db = None


def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    room = sys.argv[1]

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
