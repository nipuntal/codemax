# Python Q15 explanation

```python
    line = re.sub(r'\s+', ' ', line)
    line = line.strip()
```
`\s+` is one or more whitespace characters — that includes the trailing `\n`, so
after this the line ends in a space, which `.strip()` then removes.
Order matters: stripping first, then collapsing, would also work here, but collapsing
first is the habit to build because it normalises tabs too.

```python
    line = re.sub(r'\d+', lambda m: str(int(m.group()) * 2), line)
```
The **function replacement**. For each match:
* `m.group()` is the matched text, e.g. `"12"`
* `int(...) * 2` → `24`
* `str(...)` because the replacement must be a string

`re.sub` calls this once per match, so `100` becomes `200` independently.
There is no way to do this with `sed` — arithmetic inside a substitution is exactly
what pushes a question from shell into Python.

```python
    line = re.sub(r'colou?r', 'color', line, flags=re.I)
```
* `u?` — the `u` is optional, so one pattern covers both spellings.
* `flags=re.I` — case insensitive, so `COLOUR` and `Color` both match.
* Note `flags=` is a **keyword** argument; the third positional argument is the
  string, and the fourth is `count`. Passing `re.I` positionally would set `count=2`.
  A real and nasty bug.

```python
    line = re.sub(r',\s*', ', ', line)
```
Match a comma plus any following whitespace, replace with exactly comma-space.
This normalises `,and` → `, and` and `,   sorted` → `, sorted` in one rule, which is
simpler than the lookahead version.

## Order of operations
Step 1 collapses whitespace, which is why step 5 rarely has more than one space to
deal with — but writing `\s*` in step 5 anyway makes it independent of what came
before. **Write each transformation so it doesn't rely on the previous one** and your
pipeline stops being fragile.

## The lookahead alternative
```python
re.sub(r',(?! )', ', ', line)
```
`(?! )` is a **negative lookahead**: "a comma not followed by a space". It matches
without consuming the next character. Good to recognise; rarely required.
