# Python Q14 explanation

```python
    line = line.strip()
```
Do this **first**. Without it the trailing `\n` is part of the string, and
`re.fullmatch(r'z\d{7}', "z5312001\n")` fails. Nearly every regex bug in this course
is a forgotten strip.

## Why fullmatch for most rules
```python
    if re.fullmatch(r'z\d{7}', line):
```
"whole line is a zID" = `fullmatch`. The equivalent `re.search(r'^z\d{7}$', line)`
works too — pick one style and stick to it.

```python
    elif re.search(r'\w@\w', line):
```
"**contains**" = `search`, and no anchors. `\w@\w` requires a word character on each
side of the `@`, so a bare `@example.com` wouldn't match.

## The order of the chain
`z5312001@ad.unsw.edu.au` matches *both* the email rule and (as a prefix) nothing
else — but note it does NOT match the zid rule, because `fullmatch` requires the whole
string. Meanwhile `z5312001` alone is checked against `zid` first, so it never reaches
`email`. **First match wins, so the order in the table is the order of your elif
chain.** Reordering silently changes answers.

## The individual patterns
| pattern | reads as |
|---|---|
| `z\d{7}`            | z then exactly 7 digits |
| `\w@\w`             | word char, @, word char |
| `\d{2}/\d{2}/\d{4}` | 2 digits, /, 2 digits, /, 4 digits |
| `-?\d+`             | optional minus, then 1+ digits |
| `[A-Za-z]+`         | 1+ letters |

`7/8/2026` fails the date rule because `\d{2}` demands two digits.
`123abc` fails `int` (letters) and `word` (digits) → `other`.
`0` is an `int`. `COMP2041` is not a `word` (it has digits) → falls to `other`.

## search vs match vs fullmatch — the exam answer
* `re.search(p, s)` — p matches **somewhere** in s
* `re.match(p, s)` — p matches at the **start** of s
* `re.fullmatch(p, s)` — p matches **all** of s
