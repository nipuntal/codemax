# Notes — editing a file in place, safely

This is the *devowel_file* weekly test.

## The bug everyone writes first
```sh
tr 'a-z' 'A-Z' < "$1" > "$1"        # DESTROYS THE FILE
```
The shell sets up redirections **before** running the command. `> "$1"` truncates the
file to zero bytes, and *then* `tr` opens it for reading and finds nothing. You end up
with an empty file.

This is true of every `cmd < f > f`. There is no way to make it work.

## The fix: a temporary file
```sh
tmp=$(mktemp)
tr 'a-z' 'A-Z' < "$1" > "$tmp"
mv "$tmp" "$1"
```
Three lines:
1. make a temp file with a unique name
2. write the transformed content there
3. move it over the original

`mv` on the same filesystem is atomic — the file is never half-written.

`mktemp` creates a uniquely-named file and prints its name. Don't invent your own
(`/tmp/mytmp`), which collides if the script runs twice at once.

`cp "$tmp" "$1" && rm "$tmp"` also works and preserves the original file's permissions
and ownership, which `mv` does not. Either is accepted; `mv` is shorter.

## `sed -i` is not the answer here
```sh
sed -i 's/x/y/' file        # GNU
sed -i '' 's/x/y/' file     # BSD/macOS -- needs an explicit empty suffix
```
`-i` is **not POSIX** and the two implementations take incompatible arguments. A script
using `sed -i` works on exactly one of {CSE, your Mac}. Under a POSIX rule, don't.
The temp-file version works everywhere.

## Printing nothing
The spec says nothing on stdout. Check it:
```sh
./q19.sh frost.txt | wc -c        # must be 0
```
Watch for stray `echo`s left over from debugging, and for `mktemp` — it *prints* the
filename, which is why you capture it with `$( )` rather than letting it leak out.

## `tr` for case conversion
```sh
tr 'a-z' 'A-Z'
```
`tr` maps the *n*th character of set 1 to the *n*th of set 2. It reads stdin only —
you cannot give it a filename, hence the `< "$1"`.

## Edge cases
* An empty file → still works, produces an empty file.
* Non-letters (`,`, `-`, spaces) are untouched: `tr` only maps what's in set 1.
* Run the script **twice** — the second run must leave the file unchanged. If your temp
  handling is wrong you'll usually see it here.
* Clean up: after `mv` the temp file is gone. If you use `cp`, remember the `rm`.
