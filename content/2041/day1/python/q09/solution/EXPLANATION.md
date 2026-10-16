# Python Q9 explanation

## is_prime
```python
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True
```
* Handle the small cases first, then loop.
* `while d * d <= n` is "while d <= sqrt(n)" without any floating-point rounding
  worries. If nothing up to sqrt(n) divides n, nothing above it can either — because
  divisors come in pairs.
* Each `return` exits the function on the spot, so no `else` is needed.

## digit_sum
```python
    return sum(int(c) for c in str(n))
```
* `str(n)` turns `123` into `"123"`.
* `for c in "123"` iterates the characters.
* `int(c)` converts each back to a number.
* `sum(...)` adds them. Note there are no square brackets — that's a **generator
  expression**, which works anywhere a list comprehension does and uses less memory.
  `sum([int(c) for c in str(n)])` is identical in effect.

**"Convert to a string, index it, convert back" is a core Python trick.** In C you'd
do repeated `% 10` and `// 10`; in Python the string route is shorter and clearer.

## reverse_number
```python
    return int(str(n)[::-1])
```
`[::-1]` is slice notation: start-to-end, step −1 → reversed.
`int("001")` is `1`, so `100` reverses to `1`, which is the natural answer.

## main and the guard
```python
if __name__ == '__main__':
    main()
```
When Python runs a file directly, it sets that file's `__name__` to `'__main__'`.
When the file is *imported*, `__name__` is the module name instead. So the guard means
"only run main() if I am the program being executed, not if I'm being imported".
That's the exam-answer sentence.

## Why split into functions at all
Each function is testable on its own — you can open `python3 -i q09.py` and call
`is_prime(97)` directly. When a question gives you function signatures, fill them in
exactly as named; markers often test the functions, not just the output.
