# Q7 explanation

```python
for arg in sys.argv[1:]:
    clean = ''.join(c.lower() for c in arg if c.isalnum())
    if clean == clean[::-1]:
        print(arg, end=' ')
print()
```

## The normalising line
```python
clean = ''.join(c.lower() for c in arg if c.isalnum())
```
* `for c in arg` — iterate characters
* `if c.isalnum()` — keep letters and digits, drop everything else
* `c.lower()` — fold case
* `''.join(...)` — glue them back into a string with nothing between

`"A man, a plan, a canal: Panama"` → `"amanaplanacanalpanama"`.

This is Python's `tr -cd 'a-zA-Z0-9' | tr 'A-Z' 'a-z'` in one expression.

## `clean[::-1]`
A slice with step −1: the reversed string. `clean == clean[::-1]` is the palindrome
test.

**Do not** write `clean == reversed(clean)` — `reversed()` returns an *iterator*, and a
string is never equal to an iterator, so the test is always False and every argument is
silently rejected. If your program prints nothing, check for this.

## Print the original, test the normalised
`print(arg, ...)` uses the untouched argument. The output shows
`A man, a plan, a canal: Panama` with its punctuation intact — the normalisation only
ever existed to make the *decision*.

## Why the edge cases work
| arg | clean | palindrome? |
|---|---|---|
| `racecar` | `racecar` | ✓ |
| `Level`   | `level`   | ✓ (case fold) |
| `12321`   | `12321`   | ✓ (`isalnum` keeps digits) |
| `!!!`     | `""`      | ✓ — the empty string equals its own reverse |
| `""`      | `""`      | ✓ |
| `x!x`     | `xx`      | ✓ |
| `ab`      | `ab`      | ✗ |

The empty-string cases are not a special case in the code — they fall out of
`"" == ""`. When a spec explicitly states an edge case, check whether your natural
code already agrees before writing an `if` for it.

## `print(arg, end=' ')` then a bare `print()`
`end=' '` replaces the newline with a space, so everything lands on one line; the final
`print()` supplies the single newline. With no arguments the loop body never runs and
you still get exactly one (empty) line.
