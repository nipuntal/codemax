# Q15 explanation

```sh
for f in *.bak; do
    [ -e "$f" ] || continue
    new=${f%.bak}
    if [ -e "$new" ]; then
        echo "$new exists"
        exit 1
    fi
    mv "$f" "$new"
done
```

## `${f%.bak}`
POSIX suffix removal — shortest match from the end. No external process, works in
dash. `main.c.bak` → `main.c`.

Contrast `${f%%.*}` (longest match from the end) which would give `main`. Choosing
`%` vs `%%` is the difference between stripping one extension and stripping all of
them; both come up.

## `exit 1`, not `continue`
The spec says *stop* with the error. `exit` terminates the script immediately, so any
`.bak` files later in the alphabet are left alone. If you used `continue`, the script
would print the message, rename everything else and exit 0 — and fail the autotest on
both the exit status and the leftover files.

Read error-handling specs as two separate requirements: **the message** and **what
happens next**.

## `[ -e "$f" ] || continue`
The unmatched-glob guard. If no `.bak` files exist the shell doesn't expand `*.bak`,
so `$f` is the literal string and `mv` would fail with a confusing error. `A || B`
runs B only when A fails, so this is a one-line "skip if it doesn't exist".

Not required by the spec, but it costs one line and makes the script honest.

## Quoting
`"$f"` and `"$new"` in every position. `mv $f $new` breaks the moment a filename
contains a space — and the marker's test directory might well have one.

## `-e` not `-f`
`-e` is "exists, any type". If a *directory* named `main.c` existed, `mv` would move
the file **into** it rather than failing — silently wrong. `-e` catches that.

## Checking your work
```sh
mkdir -p /tmp/t && cd /tmp/t && rm -f *
touch a.bak b.bak && dash ~/COMP2041/day2/shell/q15/q15.sh && ls
touch c.bak c && dash ~/COMP2041/day2/shell/q15/q15.sh; echo "status=$?"
```
Test the error path explicitly — it is half the marks.
