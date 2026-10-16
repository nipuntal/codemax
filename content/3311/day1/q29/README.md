# Module 29 &nbsp;·&nbsp; Python + Psycopg2

## Getting the output exactly right


## LEARN FIRST

This module is worth more marks than it looks. Exam Python questions are graded
by comparing your output with the expected output **character by character**. A
correct answer with a wrong column width scores nothing.

### Field widths

A width goes after a colon inside the `{}`:

```python
name, n = "MECH-G15", 23
print(f"{name:20}")      # left-aligned in 20 characters   (text default)
print(f"{n:5}")          # right-aligned in 5 characters   (number default)
print(f"{name:<20}")     # force left
print(f"{name:>20}")     # force right
print(f"{name:^20}")     # centre
```

Text goes left by default, numbers go right. Say which you want anyway — it
documents the intent and protects you if the value's type changes.

### Numbers

```python
x = 21.116666
print(f"{x:.1f}")        # 21.1        one decimal place
print(f"{x:8.2f}")       # "   21.12"  width 8, two decimals
print(f"{n:03}")         # 023         zero-padded to 3
```

### A width from a variable

```python
w = 24
print(f"{name:{w}}")     # nested braces
```

### The habits that stop you losing marks

**Read the expected output as characters, not as a picture.** Count the spaces.

```bash
cat -A tests/01.expected | head -3
```

`cat -A` shows every space and marks the end of each line with `$`. If the
expected line ends `...23$` and yours ends `...23   $`, you have trailing
spaces and the test fails.

**Watch the last column.** `f"{name:<20}"` pads a short name out to 20
characters. If that field is last on the line, every line ends in invisible
spaces. Either do not pad the last field, or `.rstrip()` the whole line:

```python
print(f"{a:<20} {b:<15} {c:>5}".rstrip())
```

Better still, arrange for a right-aligned number to be last — then there is
nothing to strip.

**Separators are part of the answer.** `A: 5`, `A : 5` and `A:5` are three
different outputs.

**Blank lines count.** `print()` always adds a newline. Do not add an extra one
at the end unless the expected output has it.

### Building a piece first, then placing it

When a field is itself made of several parts, build it, then pad it:

```python
span = f"{st}-{en}"
print(f"{course:<10} {span:>7} {room}")
```

Padding `st` and `en` separately would misalign, because their widths vary.

### Comparing your output with the expected

```bash
diff <(./q29.py 'Computer Lab') tests/01.expected
```

`diff` shows exactly which lines differ. Combined with `cat -A` this finds
almost every formatting bug in under a minute.

---

## THE TASK

Given a room type, print a table of those rooms.

```
$ ./q29.py 'Computer Lab'
AGSM-LG06             30     1
EE-130                30     1
...
10 Computer Lab rooms, 97 classes
```

Rules, exactly:

- one line per room:
  - the room name left-aligned in **width 20**, then a space
  - the capacity right-aligned in **width 3**, then two spaces
  - the number of classes held there, right-aligned in **width 4**
- ordered by room name
- then a final line: `N TYPE rooms, C classes` where `C` is the total across
  those rooms
- an unknown room type → `No such room type` and nothing else
- wrong argument count → `USAGE`

## Hints

<details><summary>Hint 1</summary>

`f"{name:<20} {cap:>3}  {n:>4}"` — count those spaces against the example.
</details>

<details><summary>Hint 2</summary>

Comparing an arbitrary string against the `rtype` enum **raises** rather than
returning nothing (modules 00 and 28). Compare against `rtype::text` instead, and
then an unknown type simply gives no rows.
</details>

<details><summary>Hint 3</summary>

Count the classes with a `left join` and `count(c.id)`, so a room with none
reports 0 (module 12).
</details>
