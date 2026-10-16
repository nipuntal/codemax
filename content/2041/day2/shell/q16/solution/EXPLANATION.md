# Q16 explanation

```sh
for arg in "$@"; do
    if echo "$arg" | tr 'A-Z' 'a-z' | grep -Eq '([a-z])\1'; then
        printf '%s ' "$arg"
    fi
done
echo
```

## `if COMMAND` — not `if [ ]`
`if` runs a command and branches on its exit status. `grep -q` is designed for exactly
this: it prints nothing and exits 0 on a match. Piping the argument in is the standard
way to regex-test a shell variable.

Flags: `-E` extended regex, `-q` quiet.

## `([a-z])\1` — a backreference
Inside the **pattern**, `\1` matches the same text group 1 matched. So:
* `hello` — `l` then `l` ✓
* `banana` — `a`s are never adjacent ✗
* `aA` — after the `tr` it is `aa`, so group 1 matches `a` and `\1` matches `a` ✓

Compare with `\1` in a *replacement* (`sed 's/(a)/[\1]/'`), where it **inserts** the
group. Same notation, opposite direction.

## Why `tr` instead of `grep -i`
```sh
echo aA | grep -Eqi '([a-z])\1'
```
matches under **GNU** grep (the CSE machines) and does **not** match under **BSD**
grep (macOS). GNU makes the backreference compare case-insensitively; BSD compares the
literal captured text. An `-i` solution is therefore implementation-dependent for
exactly the inputs this question cares about.

`tr 'A-Z' 'a-z'` folds the string before the regex ever sees it, so both greps agree.
**When a flag's behaviour is unspecified for the feature you're using, do the work
explicitly.**

## `printf '%s '` not `echo -n`
Two reasons:
1. `echo -n` is a bash extension. dash's `echo` prints `-n` as literal text.
2. `printf '%s ' "$arg"` keeps the format string and the data **separate**. Writing
   `printf "$arg "` would let an argument like `100%` or `a\tb` be interpreted as
   format directives — a real bug, not a style preference.

The final bare `echo` supplies the single newline, so the output is exactly one line.

## The zero-argument case
`for arg in "$@"` with no arguments iterates zero times, so nothing is printed by the
loop and the trailing `echo` emits an empty line. The spec asks for one line of output
— which this gives. Run `./q16.sh | wc -l` and confirm you get `1`.

## `"$@"` with the quotes
Unquoted `$@` word-splits, so `./q16.sh "hello there"` would be treated as two
arguments. Quoted, each argument stays intact. This matters here because arguments
with spaces would be tested and printed separately otherwise.

## A `case`-based alternative (no external programs at all)
```sh
case "$arg" in
    *aa*|*bb*|*cc*|...) printf '%s ' "$arg" ;;
esac
```
Correct, but 26 patterns × case-folding. The `grep` version says what you mean. Use
`case` when the test is a simple glob, `grep` when it's a real pattern.
