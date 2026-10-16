# Python Q18 — os, files and directories  (modules)

**Difficulty:** ⭐⭐⭐ · **Target time:** 8 min

---
## LEARN FIRST

```python
import os
import os.path

os.listdir(".")                  # list of names in a directory (unsorted!)
os.path.isfile(p)                # is it a regular file?
os.path.isdir(p)                 # is it a directory?
os.path.exists(p)
os.path.getsize(p)               # bytes
os.path.join("data", "a.txt")    # "data/a.txt"   -- build paths with this
os.path.basename("a/b/c.txt")    # "c.txt"
os.path.dirname("a/b/c.txt")     # "a/b"
os.path.splitext("c.txt")        # ("c", ".txt")
```

| shell | python |
|---|---|
| `ls`            | `os.listdir(".")` |
| `[ -f x ]`      | `os.path.isfile(x)` |
| `[ -d x ]`      | `os.path.isdir(x)` |
| `basename f .txt` | `os.path.splitext(os.path.basename(f))[0]` |
| `*.txt` glob    | `glob.glob("*.txt")` |

**`os.listdir` does not sort.** Always `sorted(os.listdir(d))` if output order matters
— which in an exam it always does.

### glob — globs, like the shell
```python
import glob
glob.glob("data/*.txt")          # a list of matching paths, unsorted
sorted(glob.glob("*.py"))
```

### Walking a whole tree
```python
for dirpath, dirnames, filenames in os.walk("."):
    for name in filenames:
        print(os.path.join(dirpath, name))
```

### Running a shell command
```python
import subprocess
subprocess.run(["wc", "-l", "file.txt"])                    # run it
out = subprocess.run(["date"], capture_output=True, text=True).stdout
os.system("ls")                                             # old and simpler
```
Prefer doing it in Python — but knowing `subprocess.run` is examinable.

---
## THE TASK

The directory `data/` contains files and one subdirectory.

Write `q18.py` that takes one directory name as an argument and prints, for the
**entries directly inside it** (not recursively), in alphabetical order:

```
NAME  TYPE  SIZE
```
where TYPE is `dir` or `file`, SIZE is the byte size for files and `-` for
directories. Use exactly two spaces between columns.

Then print:
```
N files, M dirs, TOTAL bytes
```

If the argument is missing or is not a directory, print
`Usage: ./q18.py <directory>` to stderr and exit 1.

Test invocation: `./q18.py data`

---
## HINTS
<details><summary>Hint 1</summary>
`for name in sorted(os.listdir(d)):` then `path = os.path.join(d, name)`.
You need the joined path for `isdir`/`getsize` — the bare name only works if you're
already in that directory.
</details>

## CHECK
```sh
./test.sh
```
