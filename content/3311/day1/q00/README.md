# Module 00 &nbsp;·&nbsp; Orientation

## The database, and how the exam works


Read this one end to end before touching anything else. It is the map.

---

## 1. What a database actually is

A **database** is a collection of **tables**. A table is a grid:

```
              columns  (named, each holding one kind of thing)
              ┌──────────┬───────────────┬────────────┐
              │    id    │     name      │ d_o_birth  │
              ├──────────┼───────────────┼────────────┤
    rows      │ 5345678  │ Andrew Bilson │ 2005-02-11 │   <- one student
   (one per   │ 5345679  │ Ailin Hallani │ 2000-01-16 │   <- another student
    thing)    │ 5345682  │ Kai Heyward   │ 2001-11-05 │
              └──────────┴───────────────┴────────────┘
                          the Students table
```

That's it. Every question in this course is about pulling rows and columns out
of grids like that, or combining several grids.

> **Where this comes from.** The theory calls a table a **relation**, a row a
> **tuple**, and a column an **attribute**. Theory module 09 covers the formal
> version. The one difference worth knowing now: in the formal model a relation
> is a *set*, so it can't contain the same row twice — but a real SQL table
> can. That is why you will sometimes see the word `distinct` later on.

---

## 2. Our database: `classes`

It describes university classes.

> Classes occur at a particular day/time each week in a particular room. Rooms
> have facilities like overhead projectors or microphones. There are different
> types of rooms: lecture theatres, tutorial rooms, etc. Different kinds of
> classes are scheduled in an appropriate kind of room. Students are scheduled
> to attend classes; whether they actually attend is another matter.

Six tables:

| table | one row is | how many |
|---|---|---|
| `Students` | a student | 7,784 |
| `Rooms` | a room on campus | 128 |
| `Classes` | one class offering, at one day and time | 514 |
| `Facilities` | a kind of equipment (projector, microphone…) | 16 |
| `Has` | "this room has this facility" | 578 |
| `Attends` | "this student is scheduled for this class" | 18,917 |

---

## 3. Primary keys: how a row is identified

Look at `Students.id`. Every student has one, and **no two students share
one**. That column is the table's **primary key** — the thing that says
*which* row you mean.

```
 id      | name
---------+---------------
 5345678 | Andrew Bilson     <- 5345678 means THIS row and no other
 5345679 | Ailin Hallani
```

The exam notes say two things about these:

- **every entity table has a unique integer primary key called `id`** —
  `Students`, `Rooms`, `Classes` and `Facilities` all work this way
- **the id values are not contiguous** — they are not 1, 2, 3, 4, 5. Student
  ids start at 5345678 and skip about; class ids are around 152992–154xxx.

That second point matters. **Never assume an id exists, and never do arithmetic
on one.** `id + 1` is not "the next student".

Two of our tables have a primary key made of **two** columns together:

```
Attends  (student_id, class_id)     -- one student, one class -- can't repeat
Has      (room_id,    facility_id)  -- one room, one facility -- can't repeat
```

That means a student can't be listed for the same class twice. Both columns
together identify the row; neither alone does.

---

## 4. Foreign keys: how tables point at each other

`Classes` has a column `held_in`. It holds a number like `1003`. That number is
**a room's id**.

```
        Classes                                   Rooms
 ┌────────┬──────────┬─────────┐          ┌──────┬───────────┬──────────┐
 │   id   │  course  │ held_in │          │  id  │   name    │ capacity │
 ├────────┼──────────┼─────────┤          ├──────┼───────────┼──────────┤
 │ 152992 │ COMP1000 │  1003 ──┼──────────┼─▶1003│ MECH-G15  │    30    │
 │ 152993 │ COMP1000 │  1003 ──┼──────────┘      │           │          │
 │ 153095 │ COMP1927 │   209 ──┼──────────┬─▶ 209│GOLDST-G02 │    20    │
 └────────┴──────────┴─────────┘          └──────┴───────────┴──────────┘
```

`held_in` is a **foreign key**: a column whose values must be ids that really
exist in another table. The database *enforces* it — you cannot insert a class
held in room 99999, because there is no such room.

Our five foreign keys, straight from the database:

```
Classes.held_in     ──▶ Rooms.id
Attends.student_id  ──▶ Students.id
Attends.class_id    ──▶ Classes.id
Has.room_id         ──▶ Rooms.id
Has.facility_id     ──▶ Facilities.id
```

> **Theory pointer.** This rule — "a value here must exist over there" — is
> called **referential integrity**, and it is one of the four kinds of
> constraint in theory module 09. The short version: constraints are promises
> the database keeps for you, so bad data is refused at the door rather than
> discovered later.

---

## 5. The whole shape, in one picture

```
   Facilities                Rooms                  Students
       │ id                  │ id                     │ id
       │                     │                        │
       └──── Has ────────────┤                        │
        (room, facility)     │                        │
          + nitems           │                        │
                             │                        │
                          Classes ─── Attends ────────┘
                     (held_in ▶ Rooms)  (student, class)
                      course, ctype,
                      day_of_week,
                      start_time, end_time
```

Two of those tables — `Has` and `Attends` — exist **only to connect** two other
tables. A room can have many facilities, and a facility can be in many rooms;
you cannot store that in either table alone, so it gets its own table with one
row per pairing. Same for students and classes.

> **Theory pointer.** That's a **many-to-many** relationship, and giving it its
> own table is the standard way to store one (theory module 12). `Has` also
> carries an extra column, `nitems` — a fact that belongs to the *pairing*, not
> to the room or the facility on its own.

---

## 6. The columns you will meet constantly

```sql
Students(id, name, d_o_birth)
Rooms(id, name, rtype, capacity)
Classes(id, course, ctype, held_in, day_of_week, start_time, end_time)
Facilities(id, name)
Has(room_id, facility_id, nitems)
Attends(student_id, class_id)
```

A few of these hold values from a **fixed list**:

```
rtype        'Lecture Theatre' | 'Tutorial Room' | 'Computer Lab' | 'Meeting Room'
ctype        'Lecture' | 'Tutorial' | 'Seminar' | 'Lab Class' | 'Tute-Lab'
day_of_week  'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
```

These are declared as **enumerated types**. Two consequences you'll feel
immediately:

- you compare them like text, in single quotes: `rtype = 'Computer Lab'`
- if you misspell one you get a **loud error**, not an empty answer. That is
  genuinely helpful — a typo in an ordinary text column just silently finds
  nothing.

`start_time` and `end_time` are plain whole numbers — hours on a 24-hour clock.
A class with `start_time = 9, end_time = 11` runs 9am to 11am.

> **Theory pointer.** Restricting a column to a fixed list is a **domain
> constraint** (theory module 10). The schema also uses `check` constraints —
> for instance `capacity > 0` and `start_time between 9 and 20`. You can rely on
> those being true of every row.

---

## 7. The exam environment, and this one

In the real exam you log in and everything below is already set up for you: a
PostgreSQL server running on your own workstation, the exam database loaded, a
browser open on the question pages, and one directory per question. **You do not
get VLab, `/localstorage` or your home directory.**

Here it is the same, with one setup command:

```bash
cd ~/COMP3311/day1_II
. ./env              # note the leading dot -- sets up your shell
```

Then:

| command | what it does |
|---|---|
| `psql` | opens an SQL shell on the `classes` database |
| `./reload-db` | rebuilds the database from scratch if you break it |
| `./check` | (inside a module) runs the tests for that question |
| `./submit q05` | records a submission, like the exam's `submit` |

---

## 8. Looking around with `psql`

Start it:

```bash
psql
```

You get a prompt:

```
classes=#
```

`=#` means *"waiting for you to start an SQL statement"*. Commands that begin
with a **backslash** are psql's own, and need no semicolon:

| command | shows |
|---|---|
| `\dt` | the list of tables |
| `\d Classes` | the columns of `Classes`, its keys and its constraints |
| `\q` | quit |

Try `\d Classes` right now. Near the bottom you will see its foreign key
spelled out — that is the database telling you exactly what section 4 described.

**If psql seems to hang**, look at the prompt:

- `classes-#` — you didn't finish the statement. Type `;` and press enter.
- `classes'#` — you opened a quote and never closed it. Type `'` then `;`.

---

## 9. How you hand in an answer

Every SQL question in this course — and in the exam — is answered by putting a
**view** into a `.sql` file.

A **view is a saved query with a name.** You write a query once, give it a name,
and afterwards that name behaves like a table:

```sql
create view BigRooms(name, capacity)
as
select name, capacity from Rooms where capacity > 200;
```

From then on:

```sql
select * from BigRooms;          -- runs the saved query and shows the result
```

It stores **no data** of its own. Every time you use the name, the query runs
again.

The names in brackets after the view's name are the **output column names** —
you choose them, and there must be exactly as many as your query produces.

So every SQL module here gives you a file shaped like this:

```sql
drop view if exists q01 cascade;
create view q01(region)
as
select ...            -- YOUR ANSWER GOES HERE
;
```

- `drop view if exists ... cascade` clears out any earlier attempt, so you can
  load the file over and over while you work. Without it, your second attempt
  would fail with "already exists".
- the marker then runs `select * from q01;` and compares what comes out.

Load your file into the database with:

```bash
psql -f q01.sql
```

which prints `CREATE VIEW` if it worked, or an error telling you the line
number if it didn't.

---

## 10. How to work a module

```bash
cd q01
cat README.md          # read it, then do the task at the bottom
                       # ...edit q01.sql...
./check                # PASSED, or a diff showing what went wrong
```

Only once you have genuinely tried:

```bash
./check solution       # runs the sample answer; your file is left untouched
cat solution/EXPLANATION.md
```

**Read the explanations even when you passed.** They are where the traps live.

---

## THE TASK

Prove your setup works.

Make a view `q00(students, rooms, classes)` with **one row**, holding the number
of rows in `Students`, in `Rooms`, and in `Classes`.

To count the rows in a table:

```sql
select count(*) from Students;
```

To get three numbers in one row, you can put each little query in brackets in
the select list:

```sql
select (select count(*) from Students), (select count(*) from Rooms), ... ;
```

```
$ ./check
test 01: PASSED
```
