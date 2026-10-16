# Python Q7 explanation

```python
    name, mark = line.split()
```
**Tuple unpacking**: `split()` gives a 2-element list, and Python assigns them to the
two names. Concise and very common in this course.

It raises `ValueError` if the line doesn't have exactly 2 fields. For a line with a
known first field and a variable rest:
```python
name, rest = line.split(maxsplit=1)
name, *others = line.split()        # others is a list of everything else
```

```python
    print(f"{name:<12}{mark:>4} {'*' * (mark // 10)}")
```
* `{name:<12}` — left-align in width 12. Strings default to left, but write the `<`
  anyway: it documents your intent and protects you if the value is ever a number.
* `{mark:>4}` — right-align in width 4.
* `'*' * (mark // 10)` — string repetition. `//` is integer division, so 72 → 7 stars,
  100 → 10 stars.
* The literal space between `{mark:>4}` and the stars is part of the required format.

```python
print(f"{'average':<12}{average:>4.1f}")
```
`4.1f` combines width and precision: total width 4, 1 decimal. `74.0` is exactly 4
characters, so no padding appears — but if the average were `7.5` you'd get `" 7.5"`.

## Getting formats right under time pressure
Copy the expected output into a comment, then build the f-string until it matches
character for character. Counting spaces by eye is how marks get lost —
`diff` your output against the sample instead.

## The `%` equivalent
```python
print("%-12s%4d %s" % (name, mark, "*" * (mark // 10)))
```
`-` = left align, `12s` = width-12 string, `4d` = width-4 integer.
