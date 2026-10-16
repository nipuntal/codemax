# Notes — building filenames from variables

This is the *Hello Files* weekly test with a twist: the file **contents** depend on the
loop counter too.

## The counting loop, again
Same as Q13 but counting up:
```sh
i=1
while [ "$i" -le "$n" ]; do
    ...
    i=$((i + 1))
done
```

## Building the filename
```sh
echo "note $i of $n" > "$2$i.txt"
```
Look at `"$2$i.txt"` carefully. The shell parses `$2` then `$i` then the literal
`.txt` — that works. But this does **not**:
```sh
> "$prefix$i.txt"      # fine
> "$prefixed.txt"      # the shell looks for a variable called `prefixed`!
```
When a variable name is followed by characters that could be part of a name, you must
brace it:
```sh
"${prefix}$i.txt"
"${prefix}${i}.txt"
```
`${VAR}` is POSIX and works in dash. **Use braces whenever the next character is a
letter, digit or underscore.** Here `$i` is followed by `.`, which can't be part of a
name, so `$i.txt` is safe — but bracing everything costs nothing and never surprises
you.

## Redirection creates the file
`> file` creates the file if it doesn't exist. You do **not** need `touch` (which is
banned anyway).

## Where the redirect goes this time
Unlike Q13, each iteration writes to a **different** file, so the redirect belongs on
the `echo`, inside the loop — not on `done`. Ask yourself each time: *one output file,
or one per iteration?*

## Edge cases
* `n = 1` → one file, containing `note 1 of 1`.
* The `n` inside the text is the *total*, not the counter — read the spec twice.
* Filenames are `PREFIX1.txt`, not `PREFIX01.txt`: no zero padding.
* A prefix containing a space (`./q14.sh 2 "my note"`) — quoting `"$prefix$i.txt"`
  handles it. Unquoted, you'd create two files with mangled names.

## Check with dash
```sh
dash -n q14.sh
```
