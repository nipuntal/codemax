# Q15 explanation

```sh
for f in "$@"; do
```
`"$@"` expands to the arguments, **each as one word even if it contains spaces**.
Compare:
* `$@`   → splits on spaces, so `my file.txt` becomes two arguments. Bug.
* `"$*"` → joins everything into ONE word. Also a bug.
* `"$@"` → correct. Memorise the quotes.

```sh
    if [ -f "$f" ]; then
```
File tests you should know:
| test | true when |
|---|---|
| `-f F` | F exists and is a regular file |
| `-d F` | F is a directory |
| `-e F` | F exists (any type) |
| `-r F` | F is readable |
| `-s F` | F exists and is non-empty |

```sh
        n=$(wc -l < "$f")
```
* `$( )` captures the output.
* `< "$f"` feeds the file **on stdin**, so `wc` prints only the number.
  `wc -l "$f"` would print `3 a.txt` and your output would have the name twice.
  This is a classic mark-losing detail.

## The whole-script shape
Notice the structure: `for` → `if/else` → `echo`. Most COMP2041 script questions are
exactly this shape. Get comfortable typing it without thinking.

## Portability note: `$((n))`
The sample solution prints `$((n))` rather than `$n`. On Linux (CSE machines)
`wc -l < f` prints a bare `3`. On macOS BSD `wc` pads it to `       3`.
Wrapping in `$(( ))` evaluates it as a number and prints it with no padding, so the
same script gives identical output on both. `$n` is what the exam expects — but
knowing this saves you real confusion when practising on a Mac.
