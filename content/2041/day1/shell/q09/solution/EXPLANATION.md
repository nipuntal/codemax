# Q9 explanation

```sh
grep -E '^z[0-9]{7}$'
```

* `^`        anchor to start of line
* `z`        a literal lowercase z
* `[0-9]{7}` exactly seven digits
* `$`        anchor to end of line

## Why each rejected line is rejected
| line | why rejected |
|---|---|
| `z531200`     | only 6 digits |
| `z53120011`   | 8 digits — `$` refuses the extra one |
| `Z5312002`    | capital Z |
| `z5312 003`   | space is not a digit |
| `zz5312005`   | `^z` then `z` is not a digit |
| `z5312006x`   | trailing `x` after 7 digits, `$` refuses |
| ` z5312007`   | leading space, so `^` isn't followed by `z` |
| `abc5312009`  | doesn't start with z |

## The anchoring lesson
Drop the `$` and `z53120011` and `z5312006x` sneak through.
Drop the `^` and ` z5312007` and `abc5312009` sneak through.
**Both anchors, every time**, unless the question says "contains".

## Portability note
`{7}` requires `-E`. Without `-E` you'd have to write `\{7\}`. Just always use `-E`.
