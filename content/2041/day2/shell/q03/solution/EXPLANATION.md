# Q3 explanation

```sh
cut -d'|' -f2,3 | sort -u | cut -d'|' -f2 | cut -d',' -f1 | sort
```

| stage | what it produces |
|---|---|
| `cut -d'|' -f2,3` | `3383025\|Thorpe, Ian Augustus       ` — the key **and** the name |
| `sort -u`         | one line per distinct student (10 lines) |
| `cut -d'|' -f2`   | `Thorpe, Ian Augustus       ` — drop the key |
| `cut -d',' -f1`   | `Thorpe` — everything before the first comma |
| `sort`            | required output order (`sort -u` sorted by zID, not by name) |

## Why the final `sort`
After `sort -u` the lines are ordered by **zID**, because that was the front of the
line. Once you strip the zID that ordering is meaningless, so you must sort again — and
this time **without `-u`**, so the two Wangs and the two Thorpes both survive.

Getting `-u` on the wrong `sort` is the single most common way to fail this question.
Say it out loud: *"dedupe on the student, sort on the name."*

## Why the surname `cut` works
`cut -d',' -f1` takes everything before the first comma. The trailing spaces live
*after* the given names, so they never reach field 1 — no stripping needed here.
That luck runs out in Q5.

## One-sed alternative
```sh
sed -E 's/^[^|]*\|([0-9]+)\|([^,]*),.*/\1 \2/' | sort -u | cut -d' ' -f2 | sort
```
Fewer processes, more to get wrong. Under time pressure the four-`cut` version is
easier to build incrementally and check stage by stage.
