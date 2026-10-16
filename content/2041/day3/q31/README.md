# Day 3 · Q31 — Join Two Files  ·  [python]  ·  ⭐⭐⭐ · 11 min

Write a Python program `q31.py` that implements a simplified `join`.

Usage: `q31.py [-a] FILE1 FILE2`

Both files contain `KEY|VALUE` lines. Keys are unique within each file. Print one line
per key that appears in **both** files:
```
KEY|VALUE1|VALUE2
```
sorted by key.

With `-a`, also print keys present in only one file, using `-` for the missing value.

```
cat names.psv
3360379|Costner
3364562|Carey
3383025|Thorpe
3860448|Steenburgen
5122456|Wang
cat marks.psv
3364562|85
3383025|72
3860448|91
3711611|64
3360379|55
./q31.py names.psv marks.psv
3360379|Costner|55
3364562|Carey|85
3383025|Thorpe|72
3860448|Steenburgen|91
./q31.py -a names.psv marks.psv
3360379|Costner|55
3364562|Carey|85
3383025|Thorpe|72
3711611|-|64
3860448|Steenburgen|91
5122456|Wang|-
```

* Input files are **not** sorted.
* Python only. No external programs.

```sh
./test.sh          # then read WALKTHROUGH.md
```
