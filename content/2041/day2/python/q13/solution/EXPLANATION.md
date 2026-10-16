# Q13 explanation

```python
def shift(c, base, size):
    return chr((ord(c) - ord(base) + n) % size + ord(base))
```

## The four steps
1. `ord(c) - ord(base)` — normalise to 0-based (`'c'` → 2, `'7'` → 7)
2. `+ n` — apply the shift
3. `% size` — wrap within the alphabet (26 letters, 10 digits)
4. `+ ord(base)` then `chr` — back to a character

Writing it once with `base` and `size` as parameters means lowercase, uppercase and
digits are three one-line calls instead of three copies of the formula. Three copies is
three chances to typo `ord('a')` where you meant `ord('A')`.

## Negative and huge shifts need no special case
Python's `%` returns a result with the sign of the divisor:
```python
(-5) % 26      # 21
(-443) % 26    # 25
443 % 26       # 1
```
So `n = -3`, `n = 443` and `n = -443` all work through the same expression. Adding
`if n < 0: n += 26` is unnecessary here — and would be *required* in C or Java, where
`%` can return a negative. Knowing which language you're in matters.

## The classification chain
```python
    if c.islower():  ...
    if c.isupper():  ...
    if c.isdigit():  ...
    return c
```
Each `if` returns, so no `elif` is needed — an early return is its own else. The final
`return c` passes through spaces, punctuation and `\n` unchanged, which is why the
output preserves the input's layout with no line handling at all.

## Reading everything at once
```python
sys.stdout.write(''.join(encrypt(c) for c in sys.stdin.read()))
```
The newlines are ordinary characters that fall through `encrypt` untouched, so
line structure is preserved for free. `sys.stdout.write` (rather than `print`) adds
nothing extra — the trailing newline is already in the data.

## The round trip is your test
```sh
./q13.py 443 < f | ./q13.py -443 | diff - f
```
If encrypt-then-decrypt reproduces the file exactly, your modular arithmetic is right
for every character class. Any sign error, wrong base or wrong modulus shows up
immediately. **When a transformation has an inverse, testing the round trip is worth
more than any number of hand-checked examples.**

## Digits and N = 26
`26 % 10` is `6`, so a shift of 26 leaves letters unchanged but moves digits by 6.
That follows from the spec as written (both use the same N). Don't "fix" it — if the
spec wanted digits unshifted at multiples of 26 it would say so.
