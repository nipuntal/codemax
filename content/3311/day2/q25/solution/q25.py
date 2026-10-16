#!/usr/bin/env python3
"""COMP3311 26T2 practice -- Question 25
The busiest hour of each weekday.
"""
import sys
import psycopg2

USAGE = f"Usage: {sys.argv[0]} "
db = None


def main():
    if len(sys.argv) != 1:
        print(USAGE)
        return

    cur = db.cursor()
    cur.execute("""
        with sizes as (
            select c.id, c.day_of_week as d, c.start_time, c.end_time,
                   count(a.student_id) as nstu
            from   Classes c left join Attends a on a.class_id = c.id
            group  by c.id, c.day_of_week, c.start_time, c.end_time
        ),
        hourly as (
            select s.d, h as hour, sum(s.nstu) as nstu, count(*) as nclasses
            from   sizes s, generate_series(s.start_time, s.end_time - 1) as h
            group  by s.d, h
        ),
        best as (
            select d, hour, nstu, nclasses,
                   rank() over (partition by d order by nstu desc, hour) as k
            from   hourly
        )
        select d::text as dayname, hour, nstu, nclasses
        from   best where k = 1
        order  by d
    """)
    for (day, hour, nstu, nclasses) in cur.fetchall():
        print(f"{day} {hour}:00  {nstu} students in {nclasses} classes")


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
