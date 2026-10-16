# Python Q9 — functions  (control flow)

**Difficulty:** ⭐⭐ · **Target time:** 7 min

---
## LEARN FIRST

```python
def grade(mark):
    if mark >= 85:
        return "HD"
    if mark >= 75:
        return "DN"
    return "FL"

print(grade(90))          # HD
```
* `def NAME(params):` then an indented body.
* `return` sends a value back **and exits the function immediately**.
* A function with no `return` gives back `None`.

### Default and keyword arguments
```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}"

greet("Alice")                      # "Hello, Alice"
greet("Alice", "Hi")                # "Hi, Alice"
greet("Alice", greeting="Hey")      # keyword argument
```

### Returning several values
```python
def stats(xs):
    return min(xs), max(xs)         # actually returns a tuple

lo, hi = stats([3, 1, 4])           # unpack it
```

### `if __name__ == '__main__':`
```python
def main():
    ...

if __name__ == '__main__':
    main()
```
This runs `main()` when the file is executed as a program, but **not** when it's
imported as a module by another file. That's the whole point: it makes your file
reusable. COMP2041 asks about this in tutorials — know the one-sentence answer.

### Scope
A variable assigned inside a function is **local** to it. To read a global you just
use it; to *assign* one you need `global x` (avoid — pass and return instead).

---
## THE TASK

Write `q09.py` containing these three functions, then a `main()` that uses them:

```python
def is_prime(n)         -> True/False
def digit_sum(n)        -> sum of the decimal digits of n
def reverse_number(n)   -> n with its digits reversed, as an int
```

`main()` reads integers from stdin (one per line) and for each prints:
```
N prime=P digitsum=D reverse=R
```
where P is `yes` or `no`.

Use `if __name__ == '__main__': main()`.

Run as: `./q09.py < numbers.txt`

---
## HINTS
<details><summary>Hint 1</summary>
`is_prime`: numbers below 2 are not prime; otherwise test divisors from 2 up to
`int(n ** 0.5) + 1`.
</details>
<details><summary>Hint 2</summary>
`digit_sum`: `sum(int(c) for c in str(n))` — turn the number into a string, add up
the digits.
`reverse_number`: `int(str(n)[::-1])` — `[::-1]` reverses a string.
</details>

## CHECK
```sh
./test.sh
```
