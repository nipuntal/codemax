# Q11 explanation

```sh
sed -E 's|([0-9]{1,2})/([0-9]{1,2})/([0-9]{4})|\3-0\2-0\1|g; s|-0([0-9][0-9])|-\1|g'
```

Two substitutions, separated by `;`, applied in order to every line.

## Step 1 — reorder and over-pad
```
s|([0-9]{1,2})/([0-9]{1,2})/([0-9]{4})|\3-0\2-0\1|g
```
* `|` as the delimiter, because the pattern is full of `/`.
* `{1,2}` / `{1,2}` / `{4}` — exactly what the spec allows, so `Version 3/4` and
  `Ratio 10/20` (one slash each) never match.
* Replacement `\3-0\2-0\1` puts year first and **always** prepends a `0` to month and
  day, giving a 2- or 3-digit field.
* `/g` — more than one date per line.

## Step 2 — remove the padding where it wasn't needed
```
s|-0([0-9][0-9])|-\1|g
```
Matches a `-`, a `0`, then **exactly two more digits**. That only happens when step 1
over-padded an already-2-digit field.

| input | after step 1 | after step 2 |
|---|---|---|
| `7/8/2026`   | `2026-08-07`  | `2026-08-07` (no `-0dd` present) |
| `28/2/2018`  | `2018-02-028` | `2018-02-28` |
| `31/12/2021` | `2021-012-031`| `2021-12-31` |
| `01/08/2026` | `2026-008-001`| `2026-08-01` |

Check `2021-012-031`: the scan finds `-012` → `-12`, continues from after it, finds
`-031` → `-31`. Both fixed in one `/g` pass.

Check `2026-08-07`: is there a `-0` followed by two digits? `-08` has one digit after
the `0`, then a `-`. `-07` likewise. No match — correctly left alone.

## Why this works at all
`sed` can't count and can't do arithmetic. The trick is **make the output uniform, then
remove what's redundant** — the second pattern is written so it can only fire on the
redundant case. This "over-apply then trim" idea is the standard answer whenever a
`sed` question seems to need an `if`.

## The delimiter
`s|…|…|` instead of `s/…/…/`. Compare the escaped version:
```sh
sed -E 's/([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})/\3-0\2-0\1/g'
```
Same behaviour, three more backslashes and much harder to check under time pressure.
