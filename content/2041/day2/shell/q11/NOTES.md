# Notes — reordering with backreferences, and padding without arithmetic

## Reordering is just group replay
```sh
sed -E 's|([0-9]+)/([0-9]+)/([0-9]+)|\3-\2-\1|g'
```
Three groups, replayed in reverse. Note the **`|` delimiter** — the pattern is full of
`/` characters, and `s|…|…|` saves you from escaping every one of them:
```sh
s/([0-9]+)\/([0-9]+)\/([0-9]+)/\3-\2-\1/g     # same thing, much worse to read
```
**Any character can delimit `s`.** When the text contains slashes, switch. This is one
of the cheapest real speed-ups in the whole course.

## Don't match too much
`([0-9]+)/([0-9]+)/([0-9]+)` would also mangle `Version 3/4` (no — that has only one
slash) but it *would* accept a 2-digit year, or a 5-digit day. The spec says 1–2 digits,
1–2 digits, exactly 4 digits:
```
([0-9]{1,2})/([0-9]{1,2})/([0-9]{4})
```
`{1,2}` and `{4}` — put the spec's numbers in the regex.

You also need `/g`: the first line has two dates.

## The padding problem
`7/8/2026` must become `2026-08-07`, not `2026-8-7`. `sed` has **no arithmetic** and no
`printf`-style formatting. So how do you zero-pad?

**Pad unconditionally, then trim.** Two substitutions:
```sh
s|([0-9]{1,2})/([0-9]{1,2})/([0-9]{4})|\3-0\2-0\1|g   # always add a leading 0
s|-0([0-9][0-9])|-\1|g                                 # remove it when there are now 3 digits
```
Trace `28/2/2018`:
* after step 1: `2018-02-028`
* step 2 finds `-028`… and would produce `2018-02-28`. But it also sees `-02` — does
  it eat that one too?

`-0([0-9][0-9])` requires **two** digits after the `0`. In `-02` there's only one digit
after the `0`, so it doesn't match. In `-028` there are two (`28`), so it strips the
`0`. The pattern is self-limiting. Work through `01/08/2026` and `1/1/2000` on paper —
that's the exercise.

## The general trick
**"Add unconditionally, then remove the excess"** is how you do conditional formatting
in a tool with no conditionals. Same idea shows up in:
* zero-padding numbers
* adding a trailing separator then deleting the last one
* wrapping every item then unwrapping the wrong ones

If a `sed` question feels like it needs an `if`, look for this pattern.

## Edge cases in the data
* `Version 3/4` — one slash, not a date. Your pattern needs two.
* `Ratio 10/20` — same.
* Two dates on line 1 → `/g` required.
* `01/08/2026` — already padded; padding then trimming must leave it unchanged.
* `31/12/2021` — both fields already two digits.
