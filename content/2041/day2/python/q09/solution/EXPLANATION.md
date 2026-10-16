# Q9 explanation

```python
NUMBER = r'-?(?:\d+\.?\d*|\.\d+)'
```

## The regex, alternative by alternative
| piece | matches |
|---|---|
| `-?`          | an optional minus sign |
| `\d+\.?\d*`   | `42`, `42.`, `42.0`, `15.50` — digits, optional dot, optional digits |
| `\|`          | or |
| `\.\d+`       | `.5` — a dot then digits, with no leading digit |

`(?: )` is **non-capturing**. With a plain `( )`, `re.findall` would return the group
contents instead of the whole match, and the leading `-` would be lost — every negative
number would come back positive. That one detail silently inverts example 3.

## Why `--90--` gives `-90`
The engine scans left to right:
* index 0: `-?` consumes the first `-`, then the pattern needs `\d` or `\.` and finds
  the second `-` → fail. Backtrack, `-?` matches empty, still needs a digit → fail.
  Advance.
* index 1: `-?` consumes the second `-`, `\d+` matches `90` → **match `-90`**.

The trailing `--` matches nothing and is ignored.

So example 3's numbers are `-.5`, `-5`, `-90`; the smallest is `-90`; the answer is the
line `c --90--`. (Compare the real weekly test, which asks for the *largest* — there the
answer is `a -.5`, and the same parse gives it.)

Confirm it rather than reasoning in your head:
```sh
python3 -c "import re; print(re.findall(r'-?(?:\d+\.?\d*|\.\d+)', 'c --90--'))"
['-90']
```
**Whenever a regex edge case determines the answer, run it.** Thirty seconds of
`re.findall` at the command line beats any amount of squinting at the pattern.

## Storing the per-line minimum
```python
minima.append(min(nums) if nums else None)
```
Compute each line's minimum once, in the first pass, and keep it alongside the line.
The second pass then just compares. Recomputing the regex in both passes also works but
does twice the work and gives you two places to get the pattern wrong.

`zip(lines, minima)` walks both lists together.

## `None` as the sentinel
```python
if m is not None and (best is None or m < best):
```
`0` and `0.0` are falsy in Python, so `if not best` would treat a real minimum of zero
as "nothing found yet". `None` plus `is None` is unambiguous.

## `print(line, end='')`
`readlines()` keeps the `\n`. Without `end=''` the output is double-spaced.

## `float()` handles them all
`float(".5")`, `float("-.5")`, `float("42.")`, `float("-90")` all work.
And `float("42") == float("42.0")` is `True`, which is why example 4 prints the line
containing `42.0` as a tie with the lines containing `42`.
