# Day 2 · Shell Q10 — Valid Enrolment Records

**Difficulty:** ⭐⭐⭐ · **Target:** 8 min · Format: **single regex**

`records.txt` contains enrolment records, some of them corrupted.

A record is **valid** if and only if the whole line is:

1. a course code: exactly 4 uppercase letters then exactly 4 digits
2. `|`
3. a zID: exactly 7 digits
4. `|`
5. a name: `Surname, Given` — a surname of one or more letters, then `, `, then one or
   more given names separated by single spaces, each starting with an uppercase letter;
   optionally followed by padding spaces
6. `|`
7. a program: exactly 4 digits, `/`, one digit
8. `|`
9. a sex: exactly one of `M` or `F`

Write a **single command** in `q10.sh` that prints only the valid records, unchanged,
in input order.

```
./q10.sh < records.txt
COMP1917|3360379|Costner, Kevin Augustus          |3978/1|M
COMP2041|3860448|Steenburgen, Mary Nell           |3978/3|F
COMP3311|3711611|Klum, Mary                       |3978/3|F
COMP9044|5122456|Wang, Wei                        |3978/2|M
```

### Rules
Single command, stdin, no `if`/`while`/`for`, POSIX.

Read `NOTES.md` — then look at `records.txt` and work out *why* each bad line is bad
**before** you write the regex.

```sh
./test.sh
```
