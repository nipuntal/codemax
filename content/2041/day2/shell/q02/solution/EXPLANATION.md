# Q2 explanation

```sh
grep -E '^COMP(2041|9044)\|' | cut -d'|' -f2 | sort -nu
```

1. `grep -E '^COMP(2041|9044)\|'` — keep only the two courses.
   * `^` anchors at the start.
   * `(2041|9044)` is alternation, which is why `-E` is needed.
   * `\|` is a **literal** pipe character — inside an extended regex an unescaped `|`
     would mean "or".
2. `cut -d'|' -f2` — field 2 is the zID.
3. `sort -nu` — numeric sort (`-n`) plus dedup (`-u`).

## The escaping tangle, spelled out
| context | `\|` means | `|` means |
|---|---|---|
| shell (unquoted) | — | start a pipeline |
| inside `'...'`   | backslash-pipe (2 chars, passed on) | a plain character passed on |
| basic regex (`grep`)   | alternation | literal pipe |
| extended regex (`grep -E`) | literal pipe | alternation |

The safest habit: **always `-E`, always single quotes, escape a literal `|` as `\|`.**

## Simpler alternative
```sh
grep -E '^COMP(2041|9044)' | cut -d'|' -f2 | sort -nu
```
Dropping the `\|` works because no other course code starts with `COMP2041`. Correct
here, fragile in general. The anchored-and-terminated version says what you mean.

## Order matters again
`cut` before `grep` would throw away the course code you need to filter on.
