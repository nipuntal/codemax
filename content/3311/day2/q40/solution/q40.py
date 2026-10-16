#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 40
Find a better room for a class.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} ClassID"
db = None


def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    try:
        cid = int(sys.argv[1])
    except ValueError:
        print(USAGE)
        return

    WANTED = {"Lecture": "Lecture Theatre", "Tutorial": "Tutorial Room",
              "Lab Class": "Computer Lab", "Tute-Lab": "Computer Lab",
              "Seminar": "Meeting Room"}

    cur = db.cursor()
    cur.execute("""
        select c.course, c.ctype, c.day_of_week, c.start_time, c.end_time,
               c.held_in, m.name, m.rtype, m.capacity,
               (select count(*) from Attends a where a.class_id = c.id)
        from   Classes c join Rooms m on c.held_in = m.id
        where  c.id = %s
    """, [cid])
    row = cur.fetchone()
    if row is None:
        print(f"No such class: {cid}")
        return
    (course, ctype, day, st, en, rid, rname, rtype, cap, nstu) = row
    course = course.strip()
    print(f"{course} {ctype}, {day} {st}-{en}, currently {rname} "
          f"({rtype}, {cap}) with {nstu} students")

    want = WANTED[ctype]
    print(f"Wanted: {want}, capacity >= {nstu}")
    print("Candidates:")

    cur.execute("""
        select   m.name, m.rtype, m.capacity,
                 exists (select 1 from Classes c2
                         where  c2.held_in = m.id
                           and  c2.day_of_week = %s
                           and  c2.start_time  < %s
                           and  %s < c2.end_time) as busy
        from     Rooms m
        where    m.rtype::text = %s
          and    m.capacity >= %s
          and    m.id <> %s
        order by busy, m.capacity, m.name
        limit    5
    """, [day, en, st, want, nstu, rid])
    rows = cur.fetchall()
    if not rows:
        print("  none available")
    for (name, rt, capacity, busy) in rows:
        print(f"  {name:<20} {rt:<17} {capacity:>3}  " + ("busy" if busy else "free"))

    ok = (rtype == want) and (cap >= nstu)
    print("Already correctly roomed" if ok else "Needs moving")


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
