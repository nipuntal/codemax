# Notes — loops without `seq`, and redirecting a whole loop

This is the *Create A File of Integers* weekly test, reversed.

## No `seq`, no `{1..10}`
`for i in {5..1}` is a **bash extension**. Under `dash` it loops once with the literal
string `{5..1}`. `seq` is banned. So you write a `while` loop with shell arithmetic:

```sh
i=$1
while [ "$i" -ge "$2" ]; do
    echo "$i"
    i=$((i - 1))
done
```
* `$(( ))` is POSIX arithmetic — a shell **built-in**, not a program. Allowed.
* `[ "$i" -ge "$2" ]` — numeric comparison. Note `-ge`, not `>=`.
* Quote the variables. `[ $i -ge $2 ]` breaks if either is empty.

## Redirecting the whole loop — the key idea
The obvious way to write to the file is wrong:
```sh
while ...; do
    echo "$i" > "$3"        # BAD: truncates the file EVERY iteration
done
```
You'd end up with a one-line file containing the last number.

`>>` (append) would work, but it reopens the file 1000 times, and if the file already
existed you'd append to the old contents.

The right way is to redirect **the loop itself**:
```sh
while ...; do
    echo "$i"
done > "$3"
```
The redirection on `done` applies to everything the loop prints. The file is opened
(and truncated) once. **This works on any compound command** — `for`, `while`, `if`,
`{ }`. It's cleaner and faster, and it's what markers look for.

## Argument handling
`$1 $2 $3` are start, stop, filename. Copy them into named variables at the top —
`start=$1` — so the code reads like the spec and so a later `shift` can't surprise you.

## Edge cases
* start == stop → exactly one line. `-ge` (not `-gt`) gets this right.
* 1000 iterations → your loop must not be quadratic; the single redirect handles that.
* The file may already exist. `>` truncates it, which is what you want.
* `$((i - 1))` — inside `$(( ))` you don't need `$` on the variable, but it's harmless.

## Testing under dash specifically
```sh
dash -n q13.sh        # syntax check without running
dash q13.sh 5 1 /tmp/x && cat /tmp/x
```
`bash` accepts things `dash` rejects. If your script only runs under bash, it fails the
autotest. Check with `dash -n` before you submit.
