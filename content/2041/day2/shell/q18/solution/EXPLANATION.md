# Q18 explanation

```sh
included=$(for f in "$@"; do
    sed -n -E 's/^#include "([^"]+)".*/\1/p' "$f"
done | sort -u)

for h in *.h; do
    [ -e "$h" ] || continue
    if ! echo "$included" | grep -qxF "$h"; then
        echo "$h"
    fi
done
```

## Phase 1 — collect
```sh
included=$(for f in "$@"; do ... done | sort -u)
```
A `for` loop inside `$( )`, with its output piped into `sort -u`. Everything the loop
prints becomes the value of `included`, one filename per line.

Collecting from **all** the `.c` files before testing is the point: `shared.h` is used
by both `a.c` and `b.c`, and `config.h` only by `b.c`. Test each header against the
combined set, not file by file.

## The extraction
```sh
sed -n -E 's/^#include "([^"]+)".*/\1/p'
```
* `-n` + the `p` flag = print only lines the substitution matched. One process instead
  of a `grep | sed` pair.
* `^#include "` anchors to the start and requires a double quote — which is exactly why
  `#include <stdio.h>` is ignored with no extra rule.
* `([^"]+)` stops at the closing quote. `(.*)` would be greedy and grab too much.

## Phase 2 — subtract
```sh
    if ! echo "$included" | grep -qxF "$h"; then
```
* `echo "$included"` — the quotes preserve the newlines, so grep sees one filename per
  line.
* `-x` whole-line match: without it, `shared.h` would also match a line `notshared.h`.
* `-F` fixed string: without it, the `.` in `config.h` is a regex wildcard and would
  match `configXh`.
* `-q` quiet, so `if` uses only the exit status.
* `!` inverts → "not included".

`grep -qxF` is *the* membership test for a list of strings. All three flags earn their
place.

## Why not `comm`?
```sh
comm -23 <(ls *.h | sort) <(echo "$included")
```
`<( )` is **process substitution — a bash extension**, not POSIX, and it fails under
dash. Under a `#!/bin/dash` rule you need temp files or a loop. The loop needs no
temp files, which some questions also forbid.

## The unmatched-glob guard
`[ -e "$h" ] || continue` — if there are no `.h` files, `*.h` stays literal and the
loop would print `*.h`. One line, always correct.
