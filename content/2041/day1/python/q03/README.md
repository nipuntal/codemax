# Python Q3 — string methods  (basics)

**Difficulty:** ⭐⭐ · **Target time:** 5 min

---
## LEARN FIRST

The string methods you will use every single question:

```python
s = "  Hello, World  "

s.strip()                  # "Hello, World"   remove whitespace both ends
s.strip().lower()          # "hello, world"
s.upper()                  # "  HELLO, WORLD  "
s.replace("l", "L")        # replace ALL occurrences
s.startswith("  He")       # True
s.endswith("  ")           # True
"World" in s               # True     <- the `in` operator, not a method
len(s)                     # 17
```

### split and join — the two most important
```python
"a,b,c".split(",")         # ['a', 'b', 'c']
"a b  c".split()           # ['a', 'b', 'c']   no argument = split on ANY whitespace,
                           #                   and runs of it collapse
"a,b,c".split(",", 1)      # ['a', 'b,c']      at most 1 split
"-".join(['a','b','c'])    # "a-b-c"
" ".join(words)            # the usual way to rebuild a line
```
`split()` with no argument is the Python version of `awk`'s field splitting —
it handles multiple spaces correctly, unlike `cut`.

### Numbers ↔ strings
```python
int("42")        # 42
float("3.14")    # 3.14
str(42)          # "42"
```

### Indexing a string
```python
w = "python"
w[0]     # 'p'
w[-1]    # 'n'
w[1:4]   # 'yth'
w[::-1]  # 'nohtyp'    reversed!
```

---
## THE TASK

`input.txt` has one sentence per line, possibly with messy spacing.

Write `q03.py` that for each line prints:
```
N words: WORD1|WORD2|WORD3
```
where N is the number of words and the words are joined with `|`.
Words are whitespace-separated. Ignore any blank lines entirely.

Run as: `./q03.py < input.txt`

---
## HINTS
<details><summary>Hint 1</summary>
`words = line.split()` handles the messy spacing for free.
</details>
<details><summary>Hint 2</summary>
Skip blanks with `if not words: continue`.
An empty list is "falsy" in Python, so `not words` means "the list is empty".
</details>

## CHECK
```sh
./test.sh
```
