# Day 2 · Shell Q11 — Normalise Dates

**Difficulty:** ⭐⭐⭐ · **Target:** 8 min · Format: **single regex**

`dates.txt` contains lines of text with dates written in the Australian format
`D/M/YYYY` or `DD/MM/YYYY` (day first, one or two digits each, always a 4-digit year).

Write a **single sed command** in `q11.sh` that rewrites **every** such date on every
line into ISO format `YYYY-MM-DD`, zero-padding the day and month to two digits.

Text that is not a date must be left alone. A date may appear more than once on a line.

```
./q11.sh < dates.txt
Due 2026-08-07 and again 2026-11-03.
No dates here at all.
Born 1999-01-05, enrolled 2018-02-28, graduated 2021-12-31.
Version 3/4 is not a date. Ratio 10/20 stays. But 2000-01-01 is a date.
Range 2026-08-01 to 2026-08-31 inclusive.
```

### Rules
Single command, stdin, no `if`/`while`/`for`, POSIX.

Read `NOTES.md` — zero-padding without arithmetic is the trick here.

```sh
./test.sh
```
