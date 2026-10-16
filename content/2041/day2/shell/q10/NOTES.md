# Notes — writing a validating regex, and reading the spec as a checklist

## Method: turn the spec into a skeleton, then fill it in
The spec is numbered for a reason. Write the skeleton first:
```
^ COURSE \| ZID \| NAME \| PROGRAM \| SEX $
```
Then substitute one piece at a time, testing after each:
```
COURSE   [A-Z]{4}[0-9]{4}
ZID      [0-9]{7}
NAME     [A-Za-z]+, [A-Z][a-z]*( [A-Z][a-z]*)* *
PROGRAM  [0-9]{4}/[0-9]
SEX      [MF]
```

## Both anchors, always
`^` and `$`. Without `$`, `3978/22` passes because the regex matched `3978/2` and
stopped caring. Without `^`, a line with junk on the front passes. **Almost every bad
record in this file is caught by one anchor or the other** — that's the lesson.

## "One or more X separated by single spaces"
This shape comes up constantly:
```
ITEM( ITEM)*
```
"one ITEM, then zero or more of (space ITEM)". Note the space is *inside* the group.
Writing `(ITEM )*ITEM` also works but reads worse. Writing `ITEM( ITEM)+` would demand
at least two.

## Optional trailing padding
` *` — zero or more spaces. Put it just before the closing `\|`. `*` (not `+`) because
a long name might have no padding at all.

## The `\|` escape
Under `-E`, `|` is alternation. Every literal pipe needs `\|`. In this pattern there
are four of them; missing one turns the whole regex into a giant alternation and it
will match almost anything.

## Exact counts, not "one or more"
`[A-Z]+[0-9]+` would accept `COMP331` and `COMPUTER12345`. The spec says exactly 4 and
exactly 4, so write `{4}`. **When a spec gives a number, put the number in the regex** —
`+` is what you use when the spec says "one or more".

## Before you write anything
Open `records.txt` and label each bad line with which rule it breaks. There are ten bad
lines and they break ten *different* rules. If your regex passes a line you predicted
would fail, you have found a real bug in your pattern — that's the exercise.
