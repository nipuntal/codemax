# Q13 explanation

```sh
i=$start
while [ "$i" -ge "$stop" ]; do
    echo "$i"
    i=$((i - 1))
done > "$file"
```

## The redirect on `done`
This is the whole question. `> "$file"` attached to `done` redirects the **entire
loop's** standard output:
* the file is opened and truncated **once**
* every `echo` inside writes to it
* it's one system call to open instead of 1000

Compare the two wrong versions:
```sh
    echo "$i" > "$file"     # truncates each time -> file contains only "1"
    echo "$i" >> "$file"    # works, but appends to pre-existing content
```
The `>> ` version passes a naive test and fails when the file already exists.

Redirecting a compound command works for `for`, `while`, `until`, `if` and `{ }`:
```sh
for f in *; do echo "$f"; done > list.txt
{ echo header; cat body; } > out.txt
```

## The arithmetic
`i=$((i - 1))` — POSIX arithmetic expansion. It is a **shell built-in**, so it's
allowed under the "no external programs" rule. The old-fashioned alternative
`i=$(expr $i - 1)` runs the external program `expr` once per iteration — banned here,
and 1000× slower.

Inside `$(( ))` a bare variable name is expanded, so `$((i - 1))` and `$(($i - 1))`
are equivalent. Pick one style.

## `-ge` not `-gt`
`start == stop` must produce one line. `-ge` includes the boundary.
Off-by-one at the loop boundary is the most likely way to lose this mark — test
`./q13.sh 7 7 x` first, before the long ranges.

## Quoting in `[ ]`
```sh
[ "$i" -ge "$stop" ]
```
If `$stop` were empty, the unquoted form becomes `[ 5 -ge ]` — a syntax error from
`[`. Quoted, it becomes `[ 5 -ge "" ]`, which gives a clean "integer expression
expected" instead. Quote every variable in every test, always.

## Why not `for`
```sh
for i in $(seq "$start" -1 "$stop")     # seq is banned
for i in {5..1}                          # bash-only, dash prints "{5..1}"
```
`while` + arithmetic is the only POSIX-and-no-external-programs route. Recognise the
constraint from the rules list: **when a question bans `seq`, it is asking for a
`while` loop.**
