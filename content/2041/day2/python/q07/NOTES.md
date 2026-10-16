# Notes — normalise, then compare with its reverse

This is the *three_vowel_echo* weekly test shape with a harder predicate.

## The whole algorithm
```python
clean = ''.join(c.lower() for c in arg if c.isalnum())
if clean == clean[::-1]:
    print(arg, end=' ')
```
Two lines. The work is all in the first one.

## Building a filtered string
```python
''.join(c for c in s if COND)
```
This is the Python equivalent of `tr -cd`. Read it as "join together every character of
s that satisfies COND". The separator is `''`, so nothing is inserted between them.

`c.lower()` inside the comprehension folds case as it goes — one pass instead of a
separate `.lower()` afterwards. Either is fine; doing it inline is one fewer step.

## The character tests
| method | true for |
|---|---|
| `c.isalnum()` | letters **or** digits |
| `c.isalpha()` | letters only |
| `c.isdigit()` | digits only |
| `c.isspace()` | whitespace |
| `c.isupper()` / `.islower()` | case |

The spec says "letter or digit" → `isalnum()`. Reading the spec and picking the right
predicate *is* the question; `isalpha()` would wrongly reject `12321`.

## Reversing
```python
s[::-1]
```
A slice with step −1. Works on strings and lists. `reversed(s)` gives an iterator, so
`s == reversed(s)` is **always False** — a subtle and popular bug. Use the slice, or
`''.join(reversed(s))`.

## Printing one line
```python
print(arg, end=' ')     # no newline, a trailing space
...
print()                 # the single newline at the end
```
The spec allows a trailing space, so this is fine. If it didn't, collect into a list
and `print(' '.join(out))`.

Note we print `arg`, the **original**, not `clean`. Same lesson as Q5: normalise for the
test, output the original.

## Edge cases
* `""` (empty argument) → `clean` is `""`, and `"" == ""` → palindrome. Look at the
  expected output for `./q07.py 12321 12345 "!!!" ""` — you get `12321 !!! ` with the
  empty string contributing nothing visible but still adding a space.
* `!!!` → `clean` is `""` → palindrome. The spec says so explicitly; check you agree.
* `x!x` → `clean` is `"xx"` → palindrome, even though the raw string isn't symmetric in
  a naive sense (it is here, but `x!!x` vs `x!x` shows the punctuation really is
  ignored).
* `a` → single character, palindrome.
* `Level` → `level` → palindrome only because of the case fold.
* `ab` → not.
