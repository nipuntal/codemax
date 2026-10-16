# Shell Q8 — putting a pipeline together  (single pipeline)

**Difficulty:** ⭐⭐⭐ · **Target time:** 8 min

---
## LEARN FIRST — how to BUILD a pipeline under exam pressure

Don't try to write the whole thing at once. Build it **left to right, checking as
you go**, piping into `head` so you don't get flooded:

```sh
cat access.log | head                       # what does the data look like?
cat access.log | cut -d' ' -f1 | head       # ok, field 1 is the IP
cat access.log | cut -d' ' -f1 | sort | uniq -c | sort -rn | head
```
Each step you *look at the output* and ask "is this closer?". This is 10x faster
than debugging a finished 6-stage pipeline.

Useful extra tools for this question:

| command | use |
|---|---|
| `awk '{print $1}'` | print field 1, **whitespace**-separated (handles runs of spaces) |
| `awk '{print $NF}'`| print the LAST field |
| `grep -o PAT`      | print only the matching part |
| `sed 's/x/y/'`     | substitute (Q10) |

`awk '{print $2}'` is the whitespace-friendly cousin of `cut -f2`. When columns are
separated by *runs* of spaces, `cut` fails and `awk` works.

---
## THE TASK

`access.log` is a web server log. Each line looks like:
```
203.0.113.8 - - [07/Aug/2026:10:14:02] "GET /index.html HTTP/1.1" 200 5120
```
Fields are space-separated: field 1 is the client IP, field 6 is `"GET`,
field 7 is the requested path.

Write a **single pipeline** in `q08.sh` that prints the **3 most requested paths**
(field 7), most requested first, in `uniq -c` format — but count **only** requests
that got status `200` (field 9).

Run as: `./q08.sh < access.log`

---
## HINTS
<details><summary>Hint 1</summary>
Filter first (`awk '$9 == 200'` or a grep), then extract field 7, then the counting
idiom, then head.
</details>
<details><summary>Hint 2</summary>
`awk '$9 == 200 {print $7}'` does the filter AND the extraction in one go.
</details>

## CHECK
```sh
./test.sh
```
