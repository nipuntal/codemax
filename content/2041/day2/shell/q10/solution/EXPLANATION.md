# Q10 explanation

```sh
grep -E '^[A-Z]{4}[0-9]{4}\|[0-9]{7}\|[A-Za-z]+, [A-Z][a-z]*( [A-Z][a-z]*)* *\|[0-9]{4}/[0-9]\|[MF]$'
```

## Why each bad line fails
| line | breaks |
|---|---|
| `comp1917\|…`                  | `[A-Z]{4}` — lowercase course code |
| `COMP331\|3383025\|…`          | `[A-Z]{4}[0-9]{4}` — only 3 digits, so the `\|` doesn't line up |
| `COMP2920\|386044\|…`          | `[0-9]{7}` — 6-digit zID |
| `COMP3411\|38637111\|…`        | `[0-9]{7}` then `\|` — 8 digits, the 8th isn't a pipe |
| `…\|Thorpe Ian Augustus\|…`    | the literal `, ` is missing |
| `…\|Thorpe, ian Augustus\|…`   | `[A-Z]` — given name starts lowercase |
| `…\|3978/22\|M`                | `[0-9]{4}/[0-9]` then `\|` — the second `2` isn't a pipe |
| `…\|3711/2\|X`                 | `[MF]` |
| `…\|3978/3\|` (empty sex)      | `[MF]` needs exactly one character |
| `…\|36478/3\|M`                | `[0-9]{4}/` — 5 digits before the slash |

Notice how many are caught by *the character after the field*. A regex validates a
field by pinning down what follows it. That's why the anchors and the literal
delimiters matter more than the field patterns themselves.

## The given-names part
```
[A-Z][a-z]*( [A-Z][a-z]*)*
```
* `[A-Z][a-z]*` — one capitalised word
* `( [A-Z][a-z]*)*` — zero or more further words, each preceded by exactly one space

`Wei` → one word. `Kevin Augustus` → one + one repeat. `Heidi June Anne` → one + two.

The space lives **inside** the repeated group. Put it outside — `[A-Z][a-z]*( [A-Z][a-z]*)* ` —
and you'd require a trailing space after the last name.

## Why ` *` and not ` +`
The padding is optional in principle; `*` accepts zero. Being stricter than the spec
costs marks just as surely as being looser.

## Testing method
Comment out pieces of the pattern and watch the pass count change:
```sh
grep -cE '^[A-Z]{4}[0-9]{4}\|' records.txt        # 12 -- catches 2
grep -cE '^[A-Z]{4}[0-9]{4}\|[0-9]{7}\|' records.txt  # 10 -- catches 2 more
```
Adding one field at a time and watching the count drop tells you exactly which clause
is doing the work — and which one you got wrong.
