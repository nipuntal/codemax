# Shell Q1 — Counting lines  (single pipeline)

**Difficulty:** ⭐ · **Target time:** 3 min

---
## LEARN FIRST

A *filter* is a program that reads text on **stdin** and writes text on **stdout**.
A **pipeline** joins them: the stdout of one becomes the stdin of the next.

```
command1 | command2 | command3
```

Four filters you will use constantly:

| command | what it does |
|---|---|
| `cat f`      | print the whole file |
| `wc -l`      | count **l**ines |
| `wc -w`      | count words |
| `grep PAT`   | print only lines containing PAT |
| `grep -c PAT`| *count* lines containing PAT |

Two rules that save you every time:

1. **`grep` and `wc` read stdin if you give them no filename.**
   `grep dog < animals.txt` and `cat animals.txt | grep dog` do the same thing.
2. `wc -l` alone prints just a number. `wc -l file.txt` prints the number **and the filename**.
   In pipelines you nearly always want the bare number, so pipe into it.

### Worked example
File `fruit.txt`:
```
apple
banana
apple pie
```
```sh
grep apple fruit.txt | wc -l
```
→ `2`   (matches `apple` and `apple pie`)

---
## THE TASK

`animals.txt` contains one animal per line.

Write a **single pipeline** in `q01.sh` that reads `animals.txt` **on stdin** and prints
the number of lines that contain the word `cat`.

Your script is run as:  `./q01.sh < animals.txt`

Expected output — a single number, on its own line.

---
## HINTS
<details><summary>Hint 1</summary>
You do not need `cat`. The file already arrives on stdin.
</details>
<details><summary>Hint 2</summary>
Two commands, one pipe: `grep ... | wc ...`
</details>

## CHECK YOUR ANSWER
```sh
./test.sh            # test yours
./test.sh solution   # see the sample solution run
cat solution/EXPLANATION.md
```
