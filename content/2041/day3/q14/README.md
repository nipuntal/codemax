# Day 3 · Q14 — Valid Records  ·  [single regex]  ·  ⭐⭐⭐ · 10 min

`records.psv` contains award records, some corrupted.

A record is **valid** if and only if the whole line is:

1. an award name — one or more words of letters separated by single spaces, where the
   **first** word starts with an uppercase letter (later words may be any case)
2. `|`
3. an award year — exactly 4 digits
4. `|`
5. a winner name — one or more words separated by single spaces, each word either
   `Capitalised` (letters and hyphens allowed after the first letter) or a single
   capital followed by a full stop
6. `|`
7. a gender — exactly `Male` or `Female`
8. `|`
9. a country — one or more words, each starting with an uppercase letter, separated by
   single spaces (must not be empty)
10. `|`
11. a birth year — exactly 4 digits

Write a **single command** in `q14.sh` that prints only the valid records, unchanged, in
input order.

```
./q14.sh < records.psv
Nobel Prize for physics|1921|Albert Einstein|Male|Germany|1879
Fields Medal|1966|Michael Atiyah|Male|United Kingdom|1929
Fields Medal|2018|Akshay Venkatesh|Male|Australia|1981
Nobel Prize for chemistry|2020|Nina N. Novak|Female|Poland|1993
Nobel Prize for peace|2014|Malala Yousafzai|Female|Pakistan|1997
ACM Turing Award|1966|Alan J. Perlis|Male|United States|1922
```

* A single command reading stdin. No `if`/`while`/`for`. POSIX.

**Before writing the regex, open `records.psv` and work out which rule each bad line
breaks.** There are six bad lines and they break six different rules.

```sh
./test.sh          # then read WALKTHROUGH.md
```
