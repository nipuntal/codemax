#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 31
Could this student be added to this class?
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} StudentID ClassID"
db = None


def main():
    if len(sys.argv) != 3:
        print(USAGE)
        return
    try:
        sid, cid = int(sys.argv[1]), int(sys.argv[2])
    except ValueError:
        print(USAGE)
        return

    cur = db.cursor()
    cur.execute("select name from Students where id = %s", [sid])
    row = cur.fetchone()
    if row is None:
        print(f"No such student: {sid}")
        return
    sname = row[0]

    cur.execute("""select c.course, c.ctype, c.day_of_week, c.start_time,
                          c.end_time, m.name, m.capacity
                   from   Classes c join Rooms m on c.held_in = m.id
                   where  c.id = %s""", [cid])
    row = cur.fetchone()
    if row is None:
        print(f"No such class: {cid}")
        return
    (course, ctype, day, st, en, room, cap) = row
    print(f"{sname} -> {course} {ctype}, {day} {st}-{en} in {room}")

    cur.execute("select count(*) from Attends where class_id = %s", [cid])
    nstu = cur.fetchone()[0]

    cur.execute("""select 1 from Attends
                   where student_id = %s and class_id = %s""", [sid, cid])
    if cur.fetchone() is not None:
        print("- already enrolled")
        print("Cannot add")
        return

    full = nstu >= cap
    print(f"- room {room} holds {cap}, currently {nstu} enrolled: "
          + ("FULL" if full else "room available"))

    cur.execute("""
        select   c.course, c.ctype, c.day_of_week, c.start_time, c.end_time
        from     Attends a join Classes c on a.class_id = c.id
        where    a.student_id = %s
          and    c.day_of_week = %s
          and    c.start_time  < %s
          and    %s < c.end_time
        order by c.start_time, c.course
    """, [sid, day, en, st])
    clashes = cur.fetchall()
    for (co, ct, d, s2, e2) in clashes:
        print(f"- clashes with {co} {ct} {d} {s2}-{e2}")
    if not clashes:
        print("- no clash with the student's timetable")

    print("Can add" if (not full and not clashes) else "Cannot add")


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
