# Notes — comparing two directories

This is the *ls_identical* weekly test, inverted: same name, **different** contents.

## The shape
```sh
for path in "$1"/*; do
    name=$(basename "$path")
    if [ -f "$2/$name" ]; then
        # exists in both -- now compare
    fi
done
```
Loop over one directory, test membership in the other, then compare.

The glob `"$1"/*` expands to **paths** (`dir1/same.txt`), not bare names. You need the
bare name both for the output and to build the path in the other directory:
```sh
name=$(basename "$path")     # external process
name=${path##*/}             # POSIX parameter expansion -- strips longest prefix ending in /
```
`${path##*/}` is the free version and works in dash. Use it.

## Comparing file contents
```sh
if cmp -s "$1/$name" "$2/$name"; then ... fi
```
* `cmp` exits 0 if the files are identical, 1 if they differ.
* `-s` = silent: no output, just the exit status. **Without `-s` it prints a message**
  and your output is polluted.
* `diff -q` also works; `cmp -s` is the byte-comparison tool and is faster.

You want the files that **differ**, so negate:
```sh
if ! cmp -s "$1/$name" "$2/$name"; then
    echo "$name"
fi
```

## Alphabetical order
The glob expands in sorted order already, so looping over `"$1"/*` gives you sorted
output for free — no `| sort` needed. Worth knowing, and worth double-checking: if you
build a list and print it at the end, you may need `sort` after all.

## Membership test
```sh
[ -f "$2/$name" ]
```
`-f` (regular file) rather than `-e`, so a *directory* with the same name in dir2 is
skipped — `cmp` on a directory would error.

## The whole thing without a loop?
```sh
diff -q dir1 dir2 | grep '^Files.*differ'
```
`diff -q` on two directories reports `Files dir1/x and dir2/x differ`. Tempting, but
you'd then have to parse the message, its wording varies between implementations
(`Files … differ` vs `Files … and … differ`), and it also reports files present in only
one directory. **Parsing another program's human-readable output is fragile.** The loop
is longer and correct.

## Edge cases
* `only1.txt` exists only in dir1 → skipped by the `-f` test.
* `only2.txt` exists only in dir2 → never visited, since you loop over dir1.
* `empty.txt` is empty in both → identical, so **not** printed. Test it: `cmp -s` on
  two empty files exits 0.
* `same.txt` identical → not printed.
* Directory arguments with a trailing slash (`dir1/`) — `"$1"/*` becomes `dir1//*`,
  which still works.
* Quote every path. `"$1"/*` with the quotes on `$1` only — the `*` must stay
  unquoted or it won't glob.
