# Notes — slicing to the middle

This is the *middle_lines* weekly test generalised from n=1-or-2 to any n.

## Derive the slice, don't guess it
Let `L` = number of lines, `n` = how many you want. You want a slice
`lines[start:start+n]` centred in the file. The number of lines to skip at each end is
```
skip = (L - n) // 2
```
and the slice is
```python
lines[skip : skip + n]
```

Check it on paper before you code:
| L | n | skip | slice | lines |
|---|---|---|---|---|
| 7 | 1 | 3 | `[3:4]` | line 3 ✓ |
| 7 | 3 | 2 | `[2:5]` | 2,3,4 ✓ |
| 7 | 7 | 0 | `[0:7]` | all ✓ |
| 6 | 2 | 2 | `[2:4]` | 2,3 ✓ |
| 0 | 0 | 0 | `[0:0]` | nothing ✓ |

The same-parity guarantee is what makes `(L - n)` even, so `// 2` is exact and the
result is genuinely centred. Without it you'd have to decide which side gets the extra
line.

**Doing this table is the exercise.** Off-by-one is the only way to lose this question,
and five lines of arithmetic on paper beats twenty minutes of `print` debugging.

## Reading the file
```python
with open(sys.argv[1]) as f:
    lines = f.readlines()
```
`readlines()` keeps the `\n` on each line, so printing with `end=''` reproduces the file
exactly:
```python
for line in lines[skip:skip + n]:
    print(line, end='')
```
Alternatively `f.read().splitlines()` strips them and you use a plain `print`. Either
is fine — just be consistent, or you get doubled or missing newlines.

## Slices don't raise
`lines[2:99]` on a 7-element list gives elements 2..6, no error. `lines[99]` raises
`IndexError`. **Slicing is forgiving, indexing is not** — which is why the empty-file
case needs no special handling here.

## Edge cases
* `n = 0` → `skip = 0`, slice `[0:0]` → prints nothing. No `if` needed.
* `n = L` → `skip = 0`, prints the whole file.
* Empty file, `n = 0` → `(0-0)//2 = 0`, `[0:0]` → nothing.
* `int(sys.argv[2])` — arguments are **strings**. Forgetting the `int()` makes
  `(L - n)` a TypeError, which at least fails loudly.
