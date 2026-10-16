# Python Q8 — loops and conditionals  (control flow)

**Difficulty:** ⭐⭐ · **Target time:** 6 min

---
## LEARN FIRST

### range
```python
range(5)          # 0 1 2 3 4          (stops BEFORE 5)
range(1, 6)       # 1 2 3 4 5
range(1, 10, 2)   # 1 3 5 7 9          step
range(10, 0, -1)  # 10 9 8 ... 1       backwards
```
`range(a, b)` **excludes** `b`. To loop 1..n inclusive: `range(1, n + 1)`.

### if / elif / else
```python
if mark >= 85:
    grade = "HD"
elif mark >= 75:
    grade = "DN"
else:
    grade = "FL"
```
Indentation *is* the syntax — 4 spaces, consistently. No braces, no `fi`.
The colon at the end of each condition line is mandatory.

### Comparisons and boolean operators
```python
==  !=  <  <=  >  >=
and  or  not              # NOT &&  ||  !
50 <= mark < 65           # chained comparisons work, and read beautifully
```

### while, break, continue
```python
while condition:
    ...
    if done: break        # leave the loop
    if skip: continue     # next iteration
```

### The ternary
```python
label = "pass" if mark >= 50 else "fail"
```
Reads as an English sentence. Very handy for one-line answers.

---
## THE TASK

Write `q08.py` that takes one integer argument `n` and prints the numbers `1` to `n`
inclusive, one per line, except:

* multiples of 3 → print `Fizz`
* multiples of 5 → print `Buzz`
* multiples of both → print `FizzBuzz`

If the argument is missing or not a positive integer, print
`Usage: ./q08.py <positive-int>` to **stderr** and exit 1.

Test invocation: `./q08.py 16`

---
## HINTS
<details><summary>Hint 1</summary>
Test the "both" case FIRST — otherwise the `% 3` branch catches 15 before you get
there.
</details>
<details><summary>Hint 2</summary>
Validate with `sys.argv[1].isdigit()` — a string method that is True only if every
character is a digit (so it also rejects `-5` and `3.5`).
</details>

## CHECK
```sh
./test.sh
./q08.py abc ; echo $?
```
