# Q17 Walkthrough — Add Filename Extensions (exam Q7, 8 marks)

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### `case` — pattern matching on a string
```sh
case "$f" in
    *.*)   echo "has a dot" ;;
    *.txt) echo "a text file" ;;
    *)     echo "something else" ;;
esac
```
* Patterns are **globs**, not regexes: `*`, `?`, `[abc]`, and `|` for alternatives.
* Each branch ends with `;;`.
* The **first** matching branch wins, so `*)` goes last.
* `esac` closes it.

`case` is the right tool whenever you're testing the *shape* of a string. For
"does it contain a dot", `case "$f" in *.*)` beats
`echo "$f" | grep -q '\.'` — no process, no escaping, no quoting puzzle.

### Testing a `#!` line with `case`
```sh
case "$line" in
    '#!'*) ;;                                  # starts with #!
    *) echo "..."; continue ;;
esac
```
`'#!'` is quoted because `#` starts a comment in shell. `*` after it means "anything
follows".

An **empty branch** (`'#!'*) ;;`) is legal and idiomatic: "if it matches, do nothing and
fall through to the code below". Reads better than negating the pattern.

### Choosing the extension — order matters!
```sh
case "$line" in
    *python*) ext=py ;;
    *perl*)   ext=pl ;;
    *sh*)     ext=sh ;;
esac
```
**`python` must be tested before `sh`.** Why? Because `#!/usr/bin/env python3` contains
no `sh`… but `#!/bin/bash` contains `sh`, and so does `#!/usr/bin/pwsh`. More
importantly, a path like `/usr/bin/python` doesn't contain `sh`, but if the ordering
were reversed a hashbang like `#!/bin/sh -e python` would go to the wrong branch.

The safe general rule: **when patterns can overlap, test the most specific first.** The
spec lists them as `perl, python, sh`; the substring `sh` is the loosest, so it goes
last.

### `continue` implements the priority list
The spec is five rules in order, and each one says "print this and move on". `continue`
jumps to the next argument, so each rule is a **guard clause**:

```sh
    case ... in *) echo "..."; continue ;; esac
    case ... in *) echo "..."; continue ;; esac
    ...
    # only reaches here if every guard passed
```
No nesting, no indentation pyramid, and the order of the guards is literally the order
of the spec. This shape is worth adopting for every multi-rule question.

### Building the new name
```sh
"$f.$ext"
```
The `.` can't be part of a variable name, so `$f.$ext` parses correctly. Bracing —
`"${f}.${ext}"` — is never wrong and is the habit to keep for cases where the next
character *could* be part of a name.

### `[ -e ]` not `[ -f ]`
```sh
if [ -e "$f.$ext" ]; then
```
`-e` is "exists, any type". If a *directory* named `script4.pl` existed, `mv` would
still fail (or do something surprising), so `-e` is the correct test.

### Capturing the first line
```sh
line=$(head -n 1 "$f")
```
Read it **once** into a variable rather than running `head` three times. Cheaper, and
more importantly it means all three `case`s see the same string.

---
## PART 2 — THE APPROACH

The spec is a checklist. Walk it top to bottom, `continue`-ing out at each failure:

1. `case "$f" in *.*)` → already has an extension.
2. Read the first line. `case "$line" in '#!'*)` → no hashbang.
3. `case "$line" in *python*|*perl*|*sh*)` → pick `ext`, else no extension for this line.
4. `[ -e "$f.$ext" ]` → target exists.
5. Otherwise `echo "mv $f $f.$ext"`.

Test each rule with the file that triggers it — `script.rs`, `script1`, `script2`,
`script3`, and `script4` after `touch script4.pl`. **All five paths are marked.**

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash

for f in "$@"; do
    case "$f" in
        *.*) echo "# $f already has an extension"; continue ;;
    esac

    line=$(head -n 1 "$f")

    case "$line" in
        '#!'*) ;;
        *) echo "# $f does not have a #! line"; continue ;;
    esac

    case "$line" in
        *python*) ext=py ;;
        *perl*)   ext=pl ;;
        *sh*)     ext=sh ;;
        *) echo "# $f no extension for #! line"; continue ;;
    esac

    if [ -e "$f.$ext" ]; then
        echo "# $f.$ext already exists"
    else
        echo "mv $f $f.$ext"
    fi
done
```

Each file:
* `script.rs` → has a dot → rule 1
* `script1` → `This file has no hashbang` → rule 2
* `script2` → `#!/usr/bin/env ruby` → hashbang, but no perl/python/sh → rule 3
* `script3` → `#!/usr/bin/env python3` → `.py`
* `script4` → `#!/usr/bin/perl` → `.pl`
* `script5` → `#!/bin/dash` → **`.sh`**. Look carefully: `dash` ends in `sh`, so the
  glob `*sh*` matches. That is not a coincidence in the test data — the exam's own
  expected output shows `mv script5 script5.sh`, and it works precisely because the rule
  is "contains the string `sh`", not "the interpreter is named sh".

  This is why the spec says *do not assume anything about the format of `#!` lines*:
  `bash`, `zsh`, `dash` and `/bin/sh` all contain `sh`, and all correctly get `.sh`.
  A cleverer script that parsed the interpreter path would have to special-case every
  shell, and would score **less**.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **The script must not rename anything.** Run it twice; the second run must produce
  identical output. If it doesn't, you executed a `mv`.
* **`python` before `sh`** in the `case`. Overlapping globs are decided by order.
* **`head -n 1` only.** The spec says do not examine other lines.
* **"Do not assume anything about the format of `#!` lines"** — this is why you use
  `*python*` (substring anywhere) rather than trying to parse the interpreter path.
* **The exact messages.** `# NAME already has an extension`,
  `# NAME does not have a #! line`, `# NAME no extension for #! line`,
  `# NAME.EXT already exists`. Note the last one names the **new** file, not the old.
  Transcribe them.
* **The `#` prefix** on messages but not on the `mv` line — so the whole output is valid
  shell you could pipe into `dash`.
* **`[ -e ]`** for the collision check, and it tests `$f.$ext`, not `$f`.
* No temp files, no `awk`.
