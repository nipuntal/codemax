# Shell Q12 — a harder validating regex  (single regex)

**Difficulty:** ⭐⭐⭐ · **Target time:** 8 min

---
## LEARN FIRST — how to build a regex piece by piece

Never write a regex in one go. Write it **left to right, one component at a time**,
and test after each piece.

Example: match a date `DD/MM/YYYY`.

1. Sketch the shape:      `^ DD / MM / YYYY $`
2. Translate each piece:  `DD` → `[0-9]{2}`, `/` → `/`, `YYYY` → `[0-9]{4}`
3. Assemble:              `^[0-9]{2}/[0-9]{2}/[0-9]{4}$`

Now tighten it if the question demands. "Day 1–31" is *not* `[1-31]`
(that means "1, 2, or 3, or 1"!). Real ranges need alternation:
```
(0[1-9]|[12][0-9]|3[01])       01..31
```
Read that as: `0` then 1-9  **OR**  1-or-2 then any digit  **OR**  3 then 0-or-1.

**Numeric ranges in regex are always alternation.** There is no `[1-31]`.

### Optional parts
```
-?[0-9]+          an optional minus sign then digits
[0-9]+(\.[0-9]+)? an integer or a decimal
(https?)://       http:// or https://
```

### Escaping literals
`. * + ? ( ) [ ] { } | ^ $ \` are special. To match one literally, backslash it:
`\.` `\+` `\$`. Inside `[ ]` almost nothing is special: `[.+]` matches a dot or a plus.

---
## THE TASK

`emails.txt` has one string per line. For this question a **valid email** is:

* one or more of `a-z`, `0-9`, `.`, `_`  (the local part)
* then `@`
* then one or more of `a-z`, `0-9`, `.`  (the domain)
* then `.` and 2–4 lowercase letters (the TLD)
* and nothing else on the line

Write a **single command** in `q12.sh` printing only the valid emails.

Run as: `./q12.sh < emails.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Shape: `^ LOCAL @ DOMAIN \. TLD $`
</details>
<details><summary>Hint 2</summary>
`^[a-z0-9._]+@[a-z0-9.]+\.[a-z]{2,4}$`
Note the `\.` before the TLD — a literal dot, not "any character".
</details>

## CHECK
```sh
./test.sh
```
