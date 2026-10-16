# Notes — one `sed` that rebuilds a whole line

## The technique
When a question says "rewrite each line as …", the answer is usually **one `sed -E`
substitution that matches the entire line and rebuilds it from capture groups**.

```sh
sed -E 's/^WHOLE LINE PATTERN$/NEW LAYOUT/'
```
The pattern has to consume the line from `^` to `$`, with `( )` around every piece you
want to keep and plain patterns over the pieces you're discarding.

## Building the pattern
Write the input format down and mark it up:
```
COMP1917 | 3360379 | Costner ,  Kevin  Augustus··· | 3978/1 | M
^course    ^zid      ^surname   ^first  ^discard     ^discard
```
Now translate left to right:
```
^([A-Z]+[0-9]+)\|([0-9]+)\|([^,]+), ([^ ]+)[^|]*\|.*$
  \1 course       \2 zid   \3 surname \4 first
```
* `([^,]+)` — surname: anything up to the comma.
* `([^ ]+)` — first name: a run of non-spaces, so it stops before any middle name.
* `[^|]*` — swallow the middle names **and the padding**, up to the next `|`.
* `\|.*$` — the program and sex fields, discarded.

Then the replacement just names the groups in the order you want:
```
z\2 \4 \3 (\1)
```

## The two ideas worth taking away
1. **"Not the delimiter" classes do the parsing.** `[^,]+`, `[^ ]+`, `[^|]*` — each one
   stops exactly where the next literal begins. `.*` is greedy and will run past your
   delimiter; only use it for "everything remaining".
2. **Escape the literal `|`.** Inside `-E`, a bare `|` means alternation. `\|` is the
   character. This one bites everybody on pipe-separated data.

## The trailing-space trap, again
The name field is padded:
```
Costner, Kevin Augustus          |
```
If your first-name group were `(.*)` it would capture `Kevin Augustus          ` —
padding and all — and your output would have a long gap. `[^ ]+` cannot cross a space,
so it stops at `Kevin`.

## Could you do it with `cut`?
Not in one stage — you need to reorder fields, and `cut` cannot reorder
(`cut -f2,1` outputs fields in file order, not the order you asked for). This is
exactly when you reach for `sed`.

## Edge cases
* `Wang, Wei` — no middle name. `[^ ]+` then `[^|]*` still works: `[^|]*` matches the
  padding (zero middle names is fine, `*` allows empty).
* `Klum, Heidi June Anne` — two middle names, both swallowed by `[^|]*`.
* No sorting — the question preserves input order, so don't add one out of habit.
