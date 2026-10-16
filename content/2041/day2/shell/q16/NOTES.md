# Notes — testing a string with `grep`, and printing without newlines

This is the *three_vowel_echo* weekly test.

## Using a command as an `if` condition
`if` tests the **exit status** of any command, not just `[ ]`:
```sh
if echo "$arg" | grep -Eq '(.)\1'; then
    ...
fi
```
* `grep -q` prints nothing and exits 0 if it matched.
* Piping the argument into `grep` is how you pattern-test a *string* in shell.

For case insensitivity you might reach for `grep -qi`. **Don't** — see the trap below.

## The doubled-letter regex
```
([a-z])\1
```
`\1` inside the **pattern** is a **backreference** — it matches whatever group 1
matched. So `([a-z])\1` means "a letter, then that same letter again".

This is different from `\1` in a *replacement*, where it means "insert group 1".
Same syntax, two jobs, depending on which side of the `s///` you're on.

`(.)\1` would also match doubled spaces or digits — the spec says *letter*, so
constrain the class.

Backreferences are **not** POSIX ERE strictly speaking, but GNU and BSD `grep -E` both
support them and COMP2041 uses them (see the real test's `'^(..).+\1.+\1$'` question).

## The trap: `-i` does NOT case-fold a backreference on every grep
```sh
echo aA | grep -Eqi '([a-z])\1'   # GNU grep (CSE): matches.  BSD grep (macOS): does NOT.
```
GNU makes `\1` compare case-insensitively; BSD compares the literal text it captured.
So an `-i` solution passes on CSE and fails on your Mac — or, worse, the reverse on
some other implementation.

**Fold the case yourself instead:**
```sh
echo "$arg" | tr 'A-Z' 'a-z' | grep -Eq '([a-z])\1'
```
Now the string really is lowercase before the backreference ever runs, and the
behaviour is identical everywhere. When correctness depends on a flag's interaction
with a non-POSIX feature, do the transformation explicitly.

## Printing on one line
`echo` adds a newline. To build one line from a loop you need output without newlines:
```sh
printf '%s ' "$arg"      # prints the argument and a space, no newline
```
then a single `echo` at the end for the final newline.

**Never write `printf "$arg"`** — if the argument contains a `%` or a `\`, printf
interprets it. Always `printf '%s ' "$arg"` with the format string separate from the
data. This is a genuine correctness bug, not style.

`echo -n` is a bash extension; dash's `echo` doesn't accept `-n`. Use `printf`.

## The empty-argument case
`./q16.sh` with no arguments must still print one line (an empty one). A `for` loop
over `"$@"` runs zero times, then the final `echo` prints the newline. That falls out
for free — but check it, because the spec calls it out.

## Edge cases
* `banana` — `a` appears repeatedly but never *adjacent*. Excluded. This is the case
  that catches a wrong regex like `.*a.*a.*`.
* `aA` / `Bb` — case-insensitive doubling. This is the case that exposes the `-i`
  portability trap above. Test it explicitly; it is the whole reason the spec says
  "case-insensitively".
* `mississippi` — `ss`, `ss`, `pp`. Matches on the first.
* Trailing space is explicitly allowed, so `printf '%s '` per argument is fine.
