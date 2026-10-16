# Q18 explanation

## `^X` notation
```python
def visible(c):
    o = ord(c)
    if o == 127:
        return '^?'
    if o < 32 and c != '\n':
        return '^' + chr(o + 64)
    return c
```
Control characters are codes 0–31. The display convention adds 64, which lands on the
`@ABCDEFG…` range:

| char | code | +64 | shown |
|---|---|---|---|
| tab   | 9  | 73 = `I` | `^I` |
| bell  | 7  | 71 = `G` | `^G` |
| NUL   | 0  | 64 = `@` | `^@` |
| DEL   | 127 | — special | `^?` |

**`and c != '\n'`** is the critical clause. Newline is code 10, so without the guard
every line would end in `^J` and the whole file would print as one line. Any
"make characters visible" question needs this exception.

## Numbering across files
```python
number = 1          # module level -- outside every loop

def do_file(f):
    global number
```
`cat -n` numbers continuously: `a.txt` ends at 3 and `b.txt` starts at 4. Resetting the
counter per file is the obvious mistake, and the two-file example catches it.

Compare Q17's `head`, where each file is independent. The programs look alike; the
state handling is opposite. **Read which one the spec wants.**

`global number` is needed because the function *assigns* to it. Passing the counter in
and returning it would avoid the `global`:
```python
def do_file(f, number):
    ...
    return number
```
Either is acceptable; `global` is shorter and this is a small script.

## `f"{number:6}  {line}"`
Width 6, right-aligned (the default for numbers), then **two literal spaces**.
`     1  first` = five spaces, `1`, two spaces, text. Count them in the spec's sample
and copy exactly — this is a pure formatting mark and a diff will catch any slip.

## -v before -n
```python
        if show_v:
            line = ''.join(visible(c) for c in line)
        if show_n:
            line = f"{number:6}  {line}"
```
The transformation runs first so the number prefix isn't itself processed. Reversing
them would be harmless *here* (digits and spaces are printable) but it's the wrong
order in principle — apply content transformations before adding decoration.

## Option splitting
```python
files = [a for a in args if a not in ('-n', '-v')]
```
Since neither option takes a value, filtering them out of the argument list is the whole
parser. Use the consuming `while` loop (Q11, Q17) only when options take arguments.

## `print(line, end='')`
Lines keep their `\n` from the file iterator, and `visible()` deliberately passes it
through. So the newline is already in the string, and `print` must not add another.
