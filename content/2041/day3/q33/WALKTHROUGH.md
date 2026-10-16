# Q33 Walkthrough — Compare Directory Trees in Python

> **Read this after you have attempted the question.**

Q27 in shell was the hardest question on the paper. In Python it is fifteen lines,
because the language has sets.

---
## PART 1 — TEACH

### `os.walk` — the recursive directory reader
```python
for dirpath, dirnames, filenames in os.walk(root):
    for name in filenames:
        full = os.path.join(dirpath, name)
```
`os.walk` yields one tuple per directory it visits:
* `dirpath` — the directory's path
* `dirnames` — subdirectory names in it
* `filenames` — regular file names in it

It is `find` with the recursion done for you. Note `filenames` contains **bare names**,
so you must `os.path.join(dirpath, name)` to get a usable path — the same "join before
you stat" rule as `os.listdir`.

### `os.path.relpath` — the prefix stripper
```python
os.path.relpath('d1/b/c/one', 'd1')     # 'b/c/one'
```
This is Q27's `sed "s|^$d1/||"`, done properly: it handles trailing slashes, `./`
prefixes and `..` correctly, where the `sed` version would break on `d1/`.

**The relative path is the identity of the file** — that's the entire concept of the
question, in both languages.

### Sets do all four counts
```python
set1 & set2      # in both
set1 - set2      # only in the first
set2 - set1      # only in the second
```
Q27 needed **two loops with four counters** because shell has no sets. Here three of the
four numbers are set operations, and only the size comparison needs a loop.

That's the real lesson of doing this question twice: **the algorithm is identical; the
language decides how much scaffolding you write.** When a question is about set logic
and you're allowed Python, the answer is short.

### `os.path.getsize`
```python
os.path.getsize(path)     # size in bytes
```
Q27's `wc -c < file`, with no redirect trap and no `stat` portability problem.

### The useful `os.path` family
| call | does |
|---|---|
| `os.path.join(a, b)`   | build a path with the right separator |
| `os.path.relpath(p, r)`| p relative to r |
| `os.path.basename(p)`  | the filename |
| `os.path.dirname(p)`   | the directory |
| `os.path.getsize(p)`   | bytes |
| `os.path.isfile(p)` / `isdir(p)` / `exists(p)` | tests |
| `os.path.splitext(p)`  | `('name', '.ext')` |

---
## PART 2 — THE APPROACH

1. A function that returns the **set of relative paths** of every file under a root.
2. Call it twice.
3. `&` for the common ones — loop those and compare `getsize`.
4. `len(set1 - set2)` and `len(set2 - set1)` for the exclusives.
5. Print four integers on one line.

---
## PART 3 — THE SOLUTION

```python
def relative_files(root):
    found = set()
    for dirpath, dirnames, filenames in os.walk(root):
        for name in filenames:
            full = os.path.join(dirpath, name)
            found.add(os.path.relpath(full, root))
    return found


set1 = relative_files(d1)
set2 = relative_files(d2)

same = diff = 0
for path in set1 & set2:
    if os.path.getsize(os.path.join(d1, path)) == os.path.getsize(os.path.join(d2, path)):
        same += 1
    else:
        diff += 1

print(f"{same} {diff} {len(set1 - set2)} {len(set2 - set1)}")
```

The supplied trees give `2 1 1 1`: `b/file2` and `b/c/one` match in size, `file1` differs
(15 vs 13 bytes), `b/three` is only in `d1` and `b/c/three` only in `d2`.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **Relative paths, not basenames.** `b/three` and `b/c/three` share a basename and must
  count as one-only-in-each. Using `name` instead of `relpath` gives `3 0 0 0` — wrong,
  and the exact case the spec warns about.
* **`os.path.join(dirpath, name)`** before `relpath`/`getsize`. `filenames` are bare
  names.
* **Sizes, not contents.** Three of the sample files have different contents and equal
  sizes.
* **One line, four integers, single-spaced.**
* Iterating `set1 & set2` gives an arbitrary order — fine here, because you're only
  counting. If you had to *print* the paths you'd need `sorted()`.
* `os.walk` only yields regular files in `filenames`, so directories are excluded for
  free — no `-type f` equivalent needed.
* **Cross-check against Q27.** Run both on the same pair of trees; the numbers must
  agree.
