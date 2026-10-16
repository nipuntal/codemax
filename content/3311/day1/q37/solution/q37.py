#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 37
A one-screen report on a course.
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} CourseCode"
db = None


### Main part of script
def main():
    if len(sys.argv) != 2:
        print(USAGE)
        return
    course = sys.argv[1]

    cur = db.cursor()
    cur.execute("""select count(*), count(distinct day_of_week),
                          coalesce(sum(end_time - start_time), 0)
                   from Classes where course = %s""", [course])
    (nclasses, ndays, nhours) = cur.fetchone()
    if nclasses == 0:
        print("No such course")
        return

    print(course)
    print(f"  {'classes:':<10}{nclasses} across {ndays} days")

    cur.execute("""select count(distinct r.id), count(distinct r.rtype)
                   from Classes c join Rooms r on c.held_in = r.id
                   where c.course = %s""", [course])
    (nrooms, ntypes) = cur.fetchone()
    print(f"  {'rooms:':<10}{nrooms} rooms, {ntypes} types")

    avg_hours = nhours / nclasses if nclasses else 0
    print(f"  {'hours:':<10}{nhours} total, {avg_hours:.1f} average")

    cur.execute("""select count(distinct a.student_id), count(*)
                   from Attends a join Classes c on a.class_id = c.id
                   where c.course = %s""", [course])
    (nstu, nenrol) = cur.fetchone()
    per = nenrol / nclasses if nclasses else 0
    print(f"  {'students:':<10}{nstu} enrolled, {per:.1f} per class")


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
