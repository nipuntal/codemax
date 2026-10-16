# Q17 explanation

```sh
while IFS=: read -r name course mark; do
```
`IFS=:` applies **only to this `read`** — a variable assignment placed in front of a
command sets it for that command alone. So the line `Alice:COMP2041:72` becomes
`name=Alice course=COMP2041 mark=72`.

```sh
    total=$((total + mark))
    count=$((count + 1))
```
Accumulators. Initialised to 0 **before** the loop — forgetting that gives you an
empty string and a syntax error on the first iteration.

```sh
echo "average: $((total / count))"
```
Integer division. Total is 449 over 6 lines → `74`, not 74.83.

## The subshell trap (worth 5 minutes of your life)
```sh
cat scores.txt | while ...; done
echo "$total"        # prints 0 !!
```
A pipeline runs each stage in its own process, so the loop's `total` dies with it.
Because our script reads **stdin directly** (`while ... done` with no pipe inside the
script), we're safe. If you ever need a pipeline feeding a counting loop, put the
final `echo` *inside* the same pipeline stage.

## Division by zero
If the input were empty, `$((total / 0))` errors. A robust script would guard:
```sh
[ "$count" -eq 0 ] && { echo "average: 0"; exit 0; }
```
The exam usually doesn't require it, but mention it if asked for "robustness marks".
