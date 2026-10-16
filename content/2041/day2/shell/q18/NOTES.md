# Notes — extracting with `sed -n …p`, and set subtraction in shell

This is the *missing_include* weekly test, inverted: instead of "included but absent",
you want "present but never included".

## Extracting the included filename
```sh
sed -n -E 's/^#include "([^"]+)".*/\1/p' "$f"
```
* `-n` — print nothing by default
* `s/…/\1/p` — the `p` **flag on the substitution** prints only lines where the
  substitution succeeded

That combination replaces a `grep` *and* a `sed`:
```sh
grep '#include "' "$f" | sed -E 's/.*"([^"]+)".*/\1/'     # two processes
sed -n -E 's/^#include "([^"]+)".*/\1/p' "$f"              # one
```
**`sed -n 's///p'` is the "filter and extract in one step" idiom.** Learn it — it shows
up in half the script questions.

## Why `"([^"]+)"` and not `"(.*)"`
`.*` is greedy and would run to the *last* quote on the line. `[^"]+` cannot cross a
quote, so it stops at the closing one. Same "not the terminator" idea as the pipeline
questions.

## Excluding angle brackets
The anchored `^#include "` already does it — `#include <stdio.h>` has a `<` where the
pattern demands a `"`, so it never matches. No extra rule needed. Notice when a
constraint is already satisfied by your pattern rather than bolting on another filter.

## Set subtraction: "in A but not in B"
Three ways, all worth knowing:
```sh
comm -23 <(sort a) <(sort b)     # bash process substitution -- NOT POSIX
grep -v -x -F -f included.txt all.txt   # needs a file
sort all included included | uniq -u    # only works if `included` has no dupes
```
The portable, obvious one is a **loop with a membership test**:
```sh
for h in *.h; do
    if ! echo "$included" | grep -qx "$h"; then
        echo "$h"
    fi
done
```
* `grep -x` — match the **whole line**, so `shared.h` doesn't match `notshared.h`
* `grep -F` — treat the pattern as a fixed string, so a `.` in the filename isn't a
  wildcard. `grep -qxF` is the correct membership test.
* `!` negates the `if`.

## Collecting the includes first
```sh
included=$(for f in "$@"; do sed -n -E 's/^#include "([^"]+)".*/\1/p' "$f"; done | sort -u)
```
A `$( )` around a whole loop captures everything it prints. Storing a multi-line list
in one variable is fine in shell — `echo "$included"` with the quotes preserves the
newlines.

## Edge cases
* A header included by **one** of several `.c` files is used → must not print.
  Hence collecting includes from *all* arguments before testing.
* A `.h` file that is included but doesn't exist is **not** this question (that's the
  original test). Read which direction you're being asked for.
* `#include <stdio.h>` must be ignored — check your output doesn't contain `stdio.h`.
* No `.h` files at all → the glob doesn't expand; guard with `[ -e "$h" ] || continue`.
