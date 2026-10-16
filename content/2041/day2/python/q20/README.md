# Day 2 · Python Q20 — Reimplement a Shell Pipeline

**Difficulty:** ⭐⭐⭐⭐⭐ · **Target:** 13 min

This shell pipeline prints the ID of every student enrolled in **exactly two** courses,
one per line, in numerical order:

```sh
cut -d'|' -f1,2 |
sort -u |
cut -d'|' -f2 |
sort | uniq -c |
grep -E '^ *2 ' |
sed -E 's/^ *[0-9]+ //' |
sort -n
```

Write a Python program `q20.py` that produces **identical output** from the same input
on stdin, in pure Python. You may not run external programs and you may not use
`subprocess`.

Then extend it: if the program is given a single integer argument `k`, it should print
the students enrolled in exactly **k** courses instead of 2. With no argument, `k` is 2.

```
./q20.py < enrollments.txt
3360582
3860448
3863711
5456732
./q20.py 1 < enrollments.txt
3360379
3364562
3371161
3711611
5122456
./q20.py 3 < enrollments.txt
3383025
./q20.py 9 < enrollments.txt

./q20.py < more_enrollments.txt | head -3
5201377
5205879
5209581
./q20.py < more_enrollments.txt | wc -l
      20
```

* Your answer must be Python only. You may not run external programs.

Read `NOTES.md`.

```sh
./test.sh
```
