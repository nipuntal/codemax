# Q12 explanation

```sh
grep -E '^[a-z0-9._]+@[a-z0-9.]+\.[a-z]{2,4}$'
```

Piece by piece:

| piece | meaning |
|---|---|
| `^`             | start of line |
| `[a-z0-9._]+`   | local part: 1+ of lowercase, digit, dot, underscore |
| `@`             | literal @ |
| `[a-z0-9.]+`    | domain body |
| `\.`            | a **literal** dot (unescaped `.` means "any char") |
| `[a-z]{2,4}`    | TLD of 2 to 4 lowercase letters |
| `$`             | end of line |

## Why each rejection happens
| line | why |
|---|---|
| `Carol@example.com`     | capital C — `[a-z]` excludes it |
| `dave@example`          | no `\.TLD` |
| `@example.com`          | `+` needs at least one local-part char |
| `eve@example.c`         | TLD is 1 char, `{2,4}` needs 2 |
| `grace@example.company` | TLD is 7 chars |
| `bad email@example.com` | space isn't in any class, and `^` anchors |
| `ian@example.com.`      | trailing dot after the TLD, `$` refuses |

## The backtracking subtlety
`[a-z0-9.]+` can itself eat dots, so for `bob.jones@cse.unsw.edu.au` the engine
matches domain = `cse.unsw.edu` and TLD = `au`. Regex engines try alternatives until
something fits — you don't have to manage this, but it explains why the "greedy"
domain class doesn't break the TLD rule.

## If the question also allowed uppercase
Add it to the classes: `^[A-Za-z0-9._]+@...` — or use `grep -Ei` for the whole thing.
