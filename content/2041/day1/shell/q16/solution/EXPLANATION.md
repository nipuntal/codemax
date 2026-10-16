# Q16 explanation

```sh
while read -r mark; do
    ...
done
```
`read` takes one line from stdin into a variable and returns false at end-of-file,
so the loop ends naturally. `-r` means "don't treat backslashes specially" — always
use it.

```sh
    if ! echo "$mark" | grep -Eq '^[0-9]+$'; then
```
* `grep -q` prints nothing; `if` uses its **exit status** (0 = matched).
* `!` negates → "if it does NOT look like a non-negative integer".
* `-5` fails because `^[0-9]+$` has no place for the minus sign. `abc` fails obviously.

## Why the chain goes high → low
Once you know `mark < 85` (because the first `elif` failed), testing `>= 75` is enough
to mean "75..84". You never need `[ "$m" -ge 75 ] && [ "$m" -lt 85 ]`.
**Ordered elif chains halve your typing and your bugs.**

## Why validate first
`[ "abc" -ge 85 ]` is a runtime error ("integer expression expected"). Validating
before comparing keeps the script clean.

## A `case` alternative for the validation
```sh
case "$mark" in
    ''|*[!0-9]*) echo "$mark invalid"; continue ;;
esac
```
`*[!0-9]*` = "contains at least one non-digit". Nice trick, but the `grep -Eq`
version is easier to read and to remember.
