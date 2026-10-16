#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 39
A course's clashing students, grouped by day.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} CourseCode"
db = None


def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    course = sys.argv[1]

    cur = db.cursor()
    cur.execute("select count(*) from Classes where course = %s", [course])
    if cur.fetchone()[0] == 0:
        print("No such course")
        return

    cur.execute("""select count(distinct a.student_id)
                   from   Attends a join Classes c on a.class_id = c.id
                   where  c.course = %s""", [course])
    nstu = cur.fetchone()[0]

    cur.execute("""
        select   c1.day_of_week::text, s.name, s.id,
                 c1.course, c1.ctype, c1.start_time, c1.end_time, c1.id,
                 c2.course, c2.ctype, c2.start_time, c2.end_time, c2.id
        from     Attends a1
                 join Attends a2 on a1.student_id = a2.student_id
                                and a1.class_id  <> a2.class_id
                 join Classes c1 on a1.class_id = c1.id
                 join Classes c2 on a2.class_id = c2.id
                 join Students s on s.id = a1.student_id
        where    c1.course = %s
          and    c1.day_of_week = c2.day_of_week
          and    c1.start_time  < c2.end_time
          and    c2.start_time  < c1.end_time
        order by s.name, s.id, c1.start_time, c2.start_time
    """, [course])

    from collections import defaultdict
    byday = defaultdict(list)
    seen = set()
    clashing = set()
    for (day, name, sid, co1, t1, s1, e1, id1, co2, t2, s2, e2, id2) in cur.fetchall():
        key = (sid, min(id1, id2), max(id1, id2))
        if key in seen:
            continue
        seen.add(key)
        clashing.add(sid)
        byday[day].append(
            f"- {name} ({sid}): {co1.strip()} {t1} {s1}-{e1} "
            f"vs {co2.strip()} {t2} {s2}-{e2}")

    print(f"{course}: {len(clashing)} of {nstu} students have a clash")
    for day in ("Mon", "Tue", "Wed", "Thu", "Fri"):
        print(day)
        if byday[day]:
            for line in byday[day]:
                print(line)
        else:
            print("- no clashes on this day")


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
