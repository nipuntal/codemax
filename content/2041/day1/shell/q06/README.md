# Shell Q6 — tr: splitting text into words  (single pipeline)

**Difficulty:** ⭐⭐⭐ · **Target time:** 7 min

---
## LEARN FIRST

`tr` = **tr**anslate characters. It only works on stdin/stdout (no filename argument!).

```sh
tr 'a-z' 'A-Z'      # lowercase -> uppercase
tr -d '0-9'         # DELETE all digits
tr -s ' '           # SQUEEZE runs of spaces into one
tr ' ' '\n'         # every space becomes a newline
```

### The famous "split into words" idiom
```sh
tr -cs 'a-zA-Z' '\n'
```
Decode it:
* `'a-zA-Z'` — the set of letters
* `-c` — **complement**: act on every character that is *not* a letter
* `-s` — **squeeze**: a run of them becomes a single output character
* `'\n'` — replace them with a newline

Net effect: **every run of non-letters becomes one newline**, so you get one word per
line. Punctuation, spaces, and newlines all disappear.

Now combine with Q4's counting idiom and you have a word-frequency counter:
```sh
tr -cs 'a-zA-Z' '\n' | sort | uniq -c | sort -rn
```
This exact pipeline appears in COMP2041 every single term. Learn it by heart.

To make it case-insensitive, lowercase first:
```sh
tr 'A-Z' 'a-z' | tr -cs 'a-z' '\n' | sort | uniq -c | sort -rn
```

---
## THE TASK

`speech.txt` is a paragraph of prose.

Write a **single pipeline** in `q06.sh` that prints the **4 most frequent words**,
most frequent first, in `uniq -c` format. Treat words case-**insensitively**
(`The` and `the` are the same word) and report them in lowercase.

Run as: `./q06.sh < speech.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Lowercase everything first, then split into words, then the counting idiom, then head.
</details>
<details><summary>Hint 2</summary>
Four pipes: `tr | tr | sort | uniq -c | sort -rn | head`
</details>

## CHECK
```sh
./test.sh
```
