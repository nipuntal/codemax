# Python Q18 explanation

```python
if len(sys.argv) != 2 or not os.path.isdir(sys.argv[1]):
```
Two checks, `or`-ed, cheapest first so `sys.argv[1]` is safe to touch.
`os.path.isdir` returns False for a missing path too, so it covers both failure modes.

```python
for name in sorted(os.listdir(directory)):
    path = os.path.join(directory, name)
```
* `os.listdir` gives **bare names** (`alpha.txt`), not paths. `os.path.isdir("alpha.txt")`
  would be False unless you happened to be inside `data/`. **You must join.** This is
  the single most common bug in directory questions.
* `sorted(...)` because `listdir` order is arbitrary (it's whatever the filesystem
  returns). Never rely on it.
* `os.path.join` inserts the `/` for you and handles a trailing slash on the directory
  name. `directory + "/" + name` usually works but join is what markers expect.

```python
        size = os.path.getsize(path)
```
Bytes. For a directory this returns the size of the directory entry itself, which is
meaningless — hence the spec's `-`.

## Skipping hidden files
`os.listdir` includes dotfiles; the shell's `*` glob does not. If a question says
"like `ls`", filter them:
```python
    if name.startswith('.'):
        continue
```
Not required here (there are none), but read the spec.

## The glob alternative
```python
import glob
for path in sorted(glob.glob(os.path.join(directory, "*"))):
    name = os.path.basename(path)
```
`glob` gives you full paths already and skips dotfiles — closer to shell semantics.

## Recursive version
```python
for dirpath, dirnames, filenames in os.walk(directory):
    for name in sorted(filenames):
        print(os.path.join(dirpath, name))
```
`os.walk` yields one tuple per directory it visits. The question said *not*
recursive — read carefully, because `os.walk` is the reflex answer and it would be
wrong here.
