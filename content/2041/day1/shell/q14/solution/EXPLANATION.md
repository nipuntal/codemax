# Q14 explanation

```sh
if [ $# -ne 2 ]; then
    echo "Usage: $0 <int> <int>" 1>&2
    exit 1
fi
```
* `$#` is the argument count. `-ne` is *numeric* "not equal".
* **Spaces inside `[ ]` are mandatory.** `[$# -ne 2]` is a syntax error — `[` is a
  *command*, and its arguments must be separated by spaces.
* `1>&2` redirects fd 1 (stdout) to fd 2 (stderr).
* `exit 1` = failure. `exit 0` = success.

```sh
echo "sum: $((a + b))"
```
* `$(( ))` evaluates integer arithmetic. Inside it, variable names don't need `$`
  (`$((a+b))` and `$(($a+$b))` both work).
* Everything is inside double quotes so the text and the expansion come out together.

## Test operators cheat sheet
| numeric | string |
|---|---|
| `-eq` equal        | `=`  equal |
| `-ne` not equal    | `!=` not equal |
| `-lt` less than    | `-z` empty string |
| `-le` less or eq   | `-n` non-empty |
| `-gt` greater      | |
| `-ge` greater or eq| |

Use the numeric ones for numbers, the string ones for text. Mixing them up
(`[ "$n" = 5 ]` when n is `05`) is a classic bug.

## Integer division
`$((17 / 5))` is `3`, not 3.4. The shell has **no floating point**. If a question
needs decimals you must use `bc`, `awk`, or Python.
