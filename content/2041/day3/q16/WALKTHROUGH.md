# Q16 Walkthrough — Print chmod Commands

> **Read this after you have attempted the question.**

Warm-up for Q17 (the exam's "add extensions") and Q19 ("symbolic links"). All three are
**print the command, don't run it** — a genre the exam loves, because it tests whether
you can inspect files without modifying them.

---
## PART 1 — TEACH

### "Print the commands, don't execute them"
The whole script is `echo`. There is no `chmod` anywhere in your answer.

That sounds obvious and people still write `chmod 755 "$f"` because their fingers know
the command. **Re-read the spec before you submit**: if it says *print*, the only
side-effect your script may have is output.

The marker's test will run your script and then check the files are **unchanged**.

### Reading only the first line
```sh
head -n 1 "$f"
```
The `#!` line must be the **first** line, so read only that. `grep '^#!' "$f"` would
match a `#!` appearing anywhere in the file — a comment on line 40, say — and give the
wrong answer.

**"The first line" means `head -n 1`, not a `grep` over the whole file.**

### Using a command as an `if` condition
```sh
if ! head -n 1 "$f" | grep -q '^#!'; then
```
`if` branches on the **exit status** of any command, not just `[ ]`.
* `grep -q` prints nothing and exits 0 on a match — designed for exactly this.
* `!` negates.
* The pipe feeds the first line into grep.

This is how you pattern-test file contents in shell. Keep it in your fingers.

### File test operators
```sh
[ -x "$f" ]     executable
[ -f "$f" ]     a regular file
[ -d "$f" ]     a directory
[ -e "$f" ]     exists (any type)
[ -r "$f" ]     readable
[ -s "$f" ]     exists and is non-empty
```
`-x` is true if the **current user** can execute it. That's what "already executable"
means operationally, and it's simpler than parsing `ls -l` output.

**Never parse `ls -l`.** Its format varies between systems and locales. If a test
operator exists for what you want, use it.

### `if / elif / else` order
The spec is a priority list, so the code is an `elif` chain in the same order:
1. not a script
2. already executable
3. otherwise

Reordering changes answers: `run3` is *both* a script and executable, and the spec says
report it as executable — which only happens because the "not a script" test comes
first and fails.

### `for f in "$@"`
Iterate the arguments. **Quote it.** Unquoted `$@` word-splits, so a filename with a
space becomes two arguments. `"$*"` joins them all into one. `"$@"` is the only correct
form.

---
## PART 2 — THE APPROACH

1. `for f in "$@"` over the filenames.
2. Test 1: does the first line start with `#!`? → `head -n 1 | grep -q '^#!'`.
3. Test 2: is it executable? → `[ -x "$f" ]`.
4. `echo` the appropriate line — three different strings, no side effects.

Then verify nothing changed: `ls -l` before and after should be identical.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash

for f in "$@"; do
    if ! head -n 1 "$f" | grep -q '^#!'; then
        echo "# $f is not a script"
    elif [ -x "$f" ]; then
        echo "# $f is already executable"
    else
        echo "chmod 755 $f"
    fi
done
```

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **The script changes nothing.** No `chmod`, no `mv`, no redirection into a file.
* **`head -n 1`**, so a `#!` later in the file doesn't count.
* **The `elif` order** — `run3` is a script *and* executable, and must report as
  executable.
* **The exact message text**, including the leading `# ` on the two comment forms and
  the absence of one on the `chmod` line. The `#` makes the output valid shell you could
  pipe into `sh` — that's the point of the format.
* **Quote `"$f"` everywhere.**
* `grep -q '^#!'` — anchored, single-quoted. `#` is a comment character to the shell, so
  the quotes are doing real work here.
* One line of output per argument, in argument order.
