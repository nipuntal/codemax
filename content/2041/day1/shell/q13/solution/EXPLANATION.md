# Q13 explanation

```sh
sed -E 's/^([^,]+), (.+)$/\2 \1/'
```

| piece | meaning |
|---|---|
| `^`          | start of line |
| `([^,]+)`    | group 1: 1+ characters that are **not a comma** → the surname |
| `, `         | literal comma-space |
| `(.+)`       | group 2: the rest → the given name |
| `$`          | end of line |
| `\2 \1`      | print group 2, a space, group 1 |

## Why `[^,]+` and not `.+` for group 1
`Van Damme, Eve` has a space in the surname, so you can't use "not a space".
But there's exactly one comma, so "not a comma" nails the split point.
With `(.+), (.+)` on a line with two commas you'd split at the **last** one — greedy.

## Why `.+` is fine for group 2
Everything after the comma-space *is* the given name; there's nothing left to
over-consume. Greedy is harmless when you're matching to `$` anyway.

## The apostrophe problem — real exam gotcha
`O'Brien` contains a `'`. That's fine inside the *data*, but if you ever need a literal
`'` **inside your single-quoted sed script**, you can't just type it. The escape is:
```sh
sed -E 's/'"'"'/X/'     # close quote, "'", reopen quote
```
Ugly. Usually easier: use double quotes and escape any `$` yourself.

## Same idea, other directions
```sh
sed -E 's/(.+) (.+)/\2, \1/'          "Alice Smith" -> "Smith, Alice"
sed -E 's/^(.)(.*)$/\U\1\E\2/'        capitalise first letter (GNU sed only)
```
