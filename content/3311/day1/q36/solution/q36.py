#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 36
Rooms never used before noon, grouped by type.
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
        select   r.rtype, r.name
        from     Rooms r
        where    not exists (select 1 from Classes c
                             where  c.held_in = r.id and c.start_time < 12)
        order by r.rtype, r.name
    """)

    from collections import defaultdict
    by_type = defaultdict(list)
    order = []
    for (rtype, name) in cur.fetchall():
        if rtype not in by_type:
            order.append(rtype)
        by_type[rtype].append(name)

    for rtype in order:
        print(f"{rtype}: " + ", ".join(by_type[rtype]))


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
