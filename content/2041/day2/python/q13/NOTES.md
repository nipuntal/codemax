# Notes — modular arithmetic on characters

This is the *caesar_cypher* weekly test, with digits added.

## `ord` and `chr`
```python
ord('a')    # 97
chr(97)     # 'a'
ord('A')    # 65
ord('0')    # 48
```
`ord` gives a character's code, `chr` converts back.

## The shift formula
For a lowercase letter:
```python
chr((ord(c) - ord('a') + n) % 26 + ord('a'))
```
Read it in four steps:
1. `ord(c) - ord('a')` — map `a..z` to `0..25`
2. `+ n` — shift
3. `% 26` — wrap
4. `+ ord('a')` — map back to a character code

**Always reduce to 0-based, do the arithmetic, then map back.** That pattern handles
uppercase (`ord('A')`, 26) and digits (`ord('0')`, 10) with only the base and modulus
changing — so write it once as a helper:

```python
def shift(c, base, size, n):
    return chr((ord(c) - ord(base) + n) % size + ord(base))
```

## Why `%` handles negative and huge N for free
Python's `%` always returns a result with the sign of the **divisor**, so
`(-5) % 26` is `21`, not `-5`. That means:
* `n = -3` works with no special case
* `n = 443` works: `443 % 26` is effectively applied by the same `%`
* `n = -443` likewise

Do **not** write `if n < 0: n += 26` — Python's `%` already did it. (This is a real
difference from C and Java, where `%` can return negative results and you *would* need
the fixup.)

Verify it once:
```sh
python3 -c "print((-5) % 26, (-443) % 26, 443 % 26)"
```

## Classifying characters
```python
c.islower()    c.isupper()    c.isdigit()
```
An `if`/`elif`/`elif`/`else` chain, with the `else` returning `c` unchanged. Everything
not a letter or digit falls through untouched — including spaces, punctuation and the
newline.

## Reading and writing
```python
text = sys.stdin.read()
sys.stdout.write(''.join(transform(c) for c in text))
```
Reading the whole input and mapping every character is simplest. The newlines are just
characters that fall to the `else` branch, so they pass through and the output layout is
preserved automatically.

Using `print` per line works too, but you must then be careful with `end=''`.

## Edge cases
* `COMP2041` with N=13 → letters shift, digits shift: `2041` → `5374`. Check that
  digit wrap: `9 + 13 = 22`, `22 % 10 = 2`.
* Round trip: `./q13.py 443 | ./q13.py -443` must reproduce the input exactly. That is
  the strongest test you can run — if the modular arithmetic is wrong anywhere, the
  round trip breaks.
* `!`, spaces, `\n` unchanged.
* N = 0 → identity.
* N = 26 → identity for letters, but **not** for digits (26 % 10 = 6). Read the spec:
  the digit shift is also N, so this is correct behaviour, not a bug.
