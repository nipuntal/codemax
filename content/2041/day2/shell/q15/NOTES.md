# Notes — suffix stripping, and stopping on the first error

This is the *htm2html* weekly test.

## Stripping a suffix — POSIX parameter expansion
```sh
new=${f%.bak}
```
`${var%pattern}` removes the **shortest** match of `pattern` from the **end**.
The full family — all POSIX, all work in dash, all free (no external process):

| form | does |
|---|---|
| `${f%.bak}`  | strip shortest match from the **end** — `a.b.bak` → `a.b` |
| `${f%%.*}`   | strip longest from the end — `a.b.bak` → `a` |
| `${f#*/}`    | strip shortest from the **front** |
| `${f##*/}`   | strip longest from the front — the `basename` idiom |
| `${f:-x}`    | use `x` if `f` is unset/empty |

**Memory aid:** `#` is at the start of a comment → strips the *front*.
`%` comes after a number in `100%` → strips the *end*. Doubling the character means
"longest match".

`basename "$f" .bak` also works and is allowed here, but it's an external process per
file and one more thing to type. Prefer `${f%.bak}`.

## The loop
```sh
for f in *.bak; do
    ...
done
```
The glob expands in alphabetical order. Note: **if no `.bak` files exist**, the shell
leaves the glob as the literal string `*.bak` and the loop runs once with that value.
The spec doesn't require handling it, but a guard is one line:
```sh
    [ -e "$f" ] || continue
```

## Stopping on the first error
```sh
if [ -e "$new" ]; then
    echo "$new exists"
    exit 1
fi
```
Read the spec precisely:
* the message is `NAME exists` where NAME is the **target** name, not the `.bak` one
* it goes to **stdout** here (the real test's example shows it unredirected — check
  each question, many want stderr)
* `exit 1` — and `exit` leaves the whole script, so files after the clash are **not**
  renamed. "Stop with" means stop.

Using `continue` instead of `exit` is the classic misreading: it would rename the
rest and finish with status 0.

## `-e` vs `-f`
`[ -e "$new" ]` is true for a directory too, which is what you want — you can't `mv`
onto a directory either. `-f` would miss that case.

## Edge cases
* `README.bak` → `README` (no other extension involved).
* `main.c.bak` → `main.c` — `%` strips the *shortest* match so only `.bak` goes.
  `%%.*` would have given `main`.
* A file literally named `.bak` → `${f%.bak}` gives the empty string. Not tested here,
  but worth noticing what your expansion does at the boundary.
* Filenames with spaces: quote `"$f"` and `"$new"` everywhere.
