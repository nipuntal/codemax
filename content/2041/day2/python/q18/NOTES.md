# Notes — character codes, and state that spans files

From the week-7 tutorial. Two independent difficulties.

## `^X` notation
Control characters are codes 0–31. The convention displays them as `^` plus the
character 64 higher:
```
 9 (tab)  -> chr(9 + 64)  = 'I'   -> ^I
 7 (bell) -> chr(7 + 64)  = 'G'   -> ^G
 0 (NUL)  -> chr(0 + 64)  = '@'   -> ^@
```
because 64 is where the uppercase letters start (`@ABC…`). DEL (127) is the exception,
shown as `^?`.

```python
def visible(c):
    o = ord(c)
    if o == 127:
        return '^?'
    if o < 32 and c != '\n':
        return '^' + chr(o + 64)
    return c
```
**Exclude the newline**, or every line ends with a literal `^J` and the output collapses
onto one line.

## Line numbers continue across files
```python
number = 1
for name in files:
    for line in f:
        print(f"{number:6}  {line}", end='')
        number += 1
```
The counter lives **outside** the file loop. Real `cat -n` numbers continuously; if you
reset per file you get `1 2 3 1 2` instead of `1 2 3 4 5`. The two-file example exists
to check this.

Contrast with Q17's `head`, where each file restarts. Same-looking programs, opposite
state handling — read the spec.

## The format
```python
f"{number:6}  {line}"
```
Width 6, right-aligned (numbers default that way), then **two** literal spaces. Count
them in the sample output: `     1  first` is five spaces, the digit, two spaces.
Getting this wrong is a silent diff failure, so copy it character by character.

## Applying -v before -n
The line number prefix must not itself be transformed, so translate the line **first**,
then prefix:
```python
if show_v:
    line = ''.join(visible(c) for c in line)
if show_n:
    line = f"{number:6}  {line}"
print(line, end='')
```
Order matters whenever two transformations compose.

## Reading with the newline intact
`for line in f` keeps the `\n`, so `print(line, end='')` reproduces the file.
The `visible()` function must therefore let `\n` through unchanged — hence the
`c != '\n'` guard.

## Edge cases
* Tab → `^I`. This is the one you can actually see in the sample.
* `\007` (bell) → `^G`.
* A line with no control characters passes through untouched.
* `-n` and `-v` together → numbering applies to the transformed line.
* Multiple files with `-n` → continuous numbering, no headers (unlike `head`).
* A file not ending in a newline — `cat` would run the next file onto the same line.
  Not tested here, but that's what real `cat` does.
