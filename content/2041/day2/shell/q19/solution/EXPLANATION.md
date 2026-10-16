# Q19 explanation

```sh
file=$1
tmp=$(mktemp)

tr 'a-z' 'A-Z' < "$file" > "$tmp"
mv "$tmp" "$file"
```

## Why you cannot do it in one command
```sh
tr 'a-z' 'A-Z' < "$file" > "$file"
```
The shell performs redirections **before** the command runs. `> "$file"` truncates the
file to zero length; `tr` then opens the now-empty file and reads nothing. Result: an
empty file and lost data.

There is no ordering trick, no flag, no quoting that fixes this. **`cmd < f > f` always
destroys `f`.** Internalise it — it applies to `sort`, `grep`, `sed`, everything.

## The temp-file dance
1. `tmp=$(mktemp)` — a uniquely-named temporary file. `mktemp` prints the name, and
   `$( )` captures it instead of letting it reach stdout (the spec forbids output).
2. Write the transformed content to the temp file.
3. `mv "$tmp" "$file"` — replace the original in one step.

Why `mktemp` and not `/tmp/tmpfile`? A fixed name collides if two copies of the script
run at once, and it's a classic security hole (someone else can pre-create it as a
symlink). `mktemp` costs nothing.

## `mv` vs `cp` + `rm`
```sh
mv "$tmp" "$file"                  # shorter; the new file has mktemp's permissions
cp "$tmp" "$file" && rm "$tmp"     # preserves the ORIGINAL file's permissions/owner
```
`mv` replaces the directory entry, so the file ends up with the temp file's mode
(usually 600). If a question cares about preserving permissions, use `cp`. Most don't.

## Why not `sed -i`
It isn't POSIX, and the syntax differs between implementations:
```sh
sed -i 's/a/b/' f        # GNU (CSE)
sed -i '' 's/a/b/' f     # BSD (macOS) -- the '' is mandatory
```
A script with `sed -i` runs correctly on exactly one of the two. Under a POSIX rule
it's simply not allowed. The temp file is portable and only two lines longer.

## Verify silence
```sh
./q19.sh frost.txt | wc -c        # 0
```
A stray `echo`, or forgetting to capture `mktemp`'s output, breaks the "prints nothing"
requirement — which is half the marks in this style of question.
