# Python Q5 — dictionaries and counting  (basics)

**Difficulty:** ⭐⭐ · **Target time:** 6 min

---
## LEARN FIRST

A dict maps **keys** to **values**.

```python
d = {}                      # empty dict
d["apple"] = 3
d["apple"]                  # 3
d["pear"]                   # KeyError!  the key doesn't exist
d.get("pear")               # None       -- no error
d.get("pear", 0)            # 0          -- default value
"apple" in d                # True
len(d)                      # 1
del d["apple"]
```

### The counting idiom — this is Q4-of-shell in Python
```python
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
```
Read `counts.get(word, 0)` as "the current count, or 0 if we haven't seen it".
This three-line pattern is worth more marks in COMP2041 than anything else in Python.

Two shortcuts that do the same thing:
```python
from collections import defaultdict
counts = defaultdict(int)
counts[word] += 1                     # missing keys default to 0
```
```python
from collections import Counter
counts = Counter(words)               # done
counts.most_common(3)                 # [('the', 8), ('a', 4), ...]
```
`Counter` is allowed and is the fastest way to answer these — but know the manual
version too, because questions sometimes ask you to explain it.

### Looping over a dict
```python
for key in d:                    # keys
for key, value in d.items():     # both  <- most useful
for value in d.values():
```

### Sorting a dict by value
```python
for word, n in sorted(counts.items(), key=lambda kv: kv[1], reverse=True):
    print(word, n)
```
`sorted(..., key=f)` sorts by `f(item)`. `lambda kv: kv[1]` means "use the value".
More on this in Q11.

---
## THE TASK

Write `q05.py` that reads words on stdin (whitespace separated, possibly several per
line) and prints each **distinct** word with its count, **in alphabetical order**:

```
WORD COUNT
```

Compare words case-insensitively and print them in lowercase.

Run as: `./q05.py < words.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Build the counts dict first, then `for word in sorted(counts):`.
Sorting a dict directly gives you its keys, sorted.
</details>

## CHECK
```sh
./test.sh
```
