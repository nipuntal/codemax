# Python Q15 — regex: re.sub  (regex)

**Difficulty:** ⭐⭐ · **Target time:** 6 min

---
## LEARN FIRST

```python
re.sub(pattern, replacement, string)
```
This is `sed 's/pattern/replacement/g'` — note it replaces **all** occurrences by
default (unlike sed, which needs the `/g`).

```python
re.sub(r'\d+', 'N', 'a1b22c333')          # 'aNbNcN'
re.sub(r'\s+', ' ', '  lots   of  space') # ' lots of space'
re.sub(r'^', '> ', line)                  # prefix
re.sub(r'cat', 'dog', s, count=1)         # only the first
```

### Backreferences in the replacement
sed uses `\1`; Python uses `\1` too, but written in a raw string:
```python
re.sub(r'(\w+), (\w+)', r'\2 \1', 'Smith, Alice')     # 'Alice Smith'
```
`\g<1>` is the unambiguous form, needed when a digit follows:
```python
re.sub(r'(\d)', r'\g<1>0', '5')          # '50'   -- r'\10' would mean group 10
```

**Both the pattern and the replacement should be raw strings.**

### A function as the replacement — very powerful
```python
re.sub(r'\d+', lambda m: str(int(m.group()) * 2), 'a3b10')   # 'a6b20'
```
The function receives the match object and returns the replacement text. This is how
you do arithmetic inside a substitution — something sed simply cannot do. Worth
knowing; it turns hard questions into three-line ones.

### Also useful
```python
re.split(r'[,;]\s*', s)      # split on a REGEX, not a fixed string
```

---
## THE TASK

`text.txt` contains messy prose.

Write `q15.py` that reads stdin and for each line applies, in this order:

1. collapse every run of whitespace into a single space
2. strip leading and trailing whitespace
3. replace every run of digits with the same number **doubled**
   (`a12b` → `a24b`)
4. replace every occurrence of `colour` or `color` (any case) with `color`
5. put a space after any `,` that isn't already followed by one

then prints the result.

Run as: `./q15.py < text.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Step 3 needs the lambda-replacement trick:
`re.sub(r'\d+', lambda m: str(int(m.group()) * 2), line)`
</details>
<details><summary>Hint 2</summary>
Step 5: `re.sub(r',(?! )', ', ', line)` uses a negative lookahead — or more simply,
`re.sub(r',\s*', ', ', line)` normalises every comma the same way.
</details>

## CHECK
```sh
./test.sh
```
