# Q9 explanation

```sh
sed -E 's/^([A-Z0-9]+)\|([0-9]+)\|([^,]+), ([^ ]+)[^|]*\|.*$/z\2 \4 \3 (\1)/'
```

## The pattern
| piece | matches | group |
|---|---|---|
| `^([A-Z0-9]+)` | `COMP1917` | 1 — course |
| `\|`           | a literal pipe | |
| `([0-9]+)`     | `3360379` | 2 — zID |
| `\|`           | | |
| `([^,]+)`      | `Costner` — up to the comma | 3 — surname |
| `, `           | the literal comma-space | |
| `([^ ]+)`      | `Kevin` — a run of non-spaces | 4 — first name |
| `[^|]*`        | ` Augustus          ` — middle names **and padding** | |
| `\|.*$`        | `3978/1\|M` | |

## The replacement
```
z\2 \4 \3 (\1)
```
Groups replayed in a completely different order — this is why `sed` and not `cut`.

## The three things that make it work
**`([^ ]+)` for the first name.** A `(.*)` there would be greedy and capture
`Kevin Augustus` plus ten spaces of padding. "A run of non-spaces" stops precisely
where you want.

**`[^|]*` for the discard.** It absorbs however many middle names there are (zero
included, because `*` allows empty) and the padding, and stops at the delimiter.
Using `.*` would run to the last `|` on the line and break the rest of the pattern.

**`\|` everywhere the pipe is literal.** Under `-E` an unescaped `|` is alternation:
`a|b` means "a or b". Forget one and your pattern silently matches something else — or
nothing, and `sed` prints the line unchanged, which looks like "my sed did nothing".

## Debugging tip
If `sed` outputs the input unchanged, your pattern **didn't match**. Don't stare at
the replacement — shorten the pattern until it does match, then add pieces back one at
a time:
```sh
sed -E 's/^([A-Z0-9]+).*$/[\1]/'        # does the course code match?
sed -E 's/^([A-Z0-9]+)\|([0-9]+).*$/[\1][\2]/'
```
Thirty seconds of this beats five minutes of guessing.
