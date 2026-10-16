# Shell Q3 — cut: pulling out columns  (single pipeline)

**Difficulty:** ⭐⭐ · **Target time:** 5 min

---
## LEARN FIRST

`cut` extracts **fields** (columns) from each line.

```sh
cut -d':' -f3        # field 3, fields separated by ':'
cut -d',' -f1,3      # fields 1 and 3
cut -d':' -f2-       # field 2 to the end
cut -f2              # TAB is the default delimiter
```

Rules to burn in:
* `-d` takes **one single character**. `-d', '` (comma-space) is an error.
* Field numbers start at **1**, not 0.
* If lines are separated by *runs of spaces*, `cut` is the wrong tool — see Q7.

This file format (`/etc/passwd` style) shows up in COMP2041 constantly:
```
username:password:uid:gid:realname:homedir:shell
```

### Worked example
```
alice:x:1001:1001:Alice Smith:/home/alice:/bin/bash
```
`cut -d':' -f1`  → `alice`
`cut -d':' -f5`  → `Alice Smith`
`cut -d':' -f1,7`→ `alice:/bin/bash`   (output keeps the delimiter)

---
## THE TASK

`passwd.txt` is in `/etc/passwd` format.

Write a **single pipeline** in `q03.sh` that prints the **username** of every user
whose login shell is `/bin/bash`, one per line, in the order they appear in the file.

Run as: `./q03.sh < passwd.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Two steps: (1) keep only the interesting lines, (2) pull out the field you want.
Filtering first is almost always easier than cutting first.
</details>
<details><summary>Hint 2</summary>
`grep '/bin/bash' | cut -d: -f1`
</details>

## CHECK
```sh
./test.sh
```
