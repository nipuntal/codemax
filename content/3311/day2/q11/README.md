# Question 11 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★☆☆☆

## Room report


Given a room **type**, print each room of that type with its capacity and how
many classes are held there.

```
$ ./q11.py 'Computer Lab'
AGSM-LG06             30    4
EE-130                30    9
...
10 Computer Lab rooms
```

Rules, exactly:

- one line per room: name left-aligned in **width 20**, then a space, capacity
  right-aligned in **width 3**, then two spaces, class count right-aligned in
  **width 4**
- ordered by room name
- final line: `N TYPE rooms`
- an unknown room type → `No such room type` and nothing else
- wrong argument count → `USAGE`

> **Tests:** exact output format, and catching a bad enum value safely.

<details><summary>Hint 1</summary>

`f"{name:<20} {cap:>3}  {n:>4}"`
</details>

<details><summary>Hint 2</summary>

Comparing an invalid string against an enum column **raises a database error**
rather than returning nothing. Validate the type first against a list you
fetch, or catch `psycopg2.Error`.
</details>
