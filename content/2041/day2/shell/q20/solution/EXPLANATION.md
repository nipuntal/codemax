# Q20 explanation

```sh
for path in "$dir1"/*; do
    [ -f "$path" ] || continue
    name=${path##*/}
    [ -f "$dir2/$name" ] || continue
    if ! cmp -s "$dir1/$name" "$dir2/$name"; then
        echo "$name"
    fi
done
```

## `"$dir1"/*` — where the quotes go
The variable is quoted, the `*` is **not**. Quote the glob (`"$dir1/*"`) and it stops
being a glob — the shell would look for a file literally named `*`.

The expansion produces full paths in **alphabetical order**, which is exactly the
output order the spec wants. No `| sort` needed.

## `${path##*/}` — basename without a process
`${var##pattern}` removes the **longest** matching prefix. The pattern `*/` means
"anything ending in a slash", so the longest such prefix of `dir1/sub/a.txt` is
`dir1/sub/` and you're left with `a.txt`.

| form | on `dir1/a.txt` |
|---|---|
| `${path##*/}` | `a.txt`  (basename) |
| `${path%/*}`  | `dir1`   (dirname) |

Both are POSIX, both work in dash, neither forks a process. `basename "$path"` is
equivalent but runs an external program once per file.

## `cmp -s`
* exit 0 → identical, exit 1 → differ.
* `-s` suppresses the `dir1/x dir2/x differ` message. **Forget `-s` and that message
  lands in your output**, which is the most common way to fail this question.
* `! cmp -s …` selects the files that differ.

`diff -q` behaves similarly; `cmp` compares bytes and stops at the first difference, so
it's the right tool for "are these the same".

## The two guards
```sh
[ -f "$path" ] || continue          # skip subdirectories in dir1
[ -f "$dir2/$name" ] || continue    # skip files not present in dir2
```
`A || continue` is the compact "skip unless" idiom. The second guard is the
"exists in both" half of the spec — `only1.txt` is filtered out here, and `only2.txt`
never comes up because we only iterate dir1.

## Why not parse `diff -q dir1 dir2`
```sh
diff -q dir1 dir2 | grep differ | ...
```
It reports files unique to one directory as well, and the exact wording of its
messages is not standardised. Parsing a tool's human-readable output is fragile —
if a question can be answered by *exit statuses* instead, use those.

## Edge case worth checking
Two **empty** files are identical, so `empty.txt` must not print. Run
`cmp -s /dev/null /dev/null; echo $?` → `0`. Confirm your script agrees.
