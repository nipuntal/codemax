# Python Q17 — re.findall  (regex)

**Difficulty:** ⭐⭐⭐ · **Target time:** 7 min

---
## LEARN FIRST

```python
re.findall(pattern, string)
```
Returns a **list of every match** — not a match object. This is `grep -o`.

```python
re.findall(r'\d+', 'a1b22c333')            # ['1', '22', '333']
re.findall(r'\w+@\w+\.\w+', text)          # every email in the text
```

### The group rule — surprising but important
* **No groups** in the pattern → a list of the whole matches.
* **One group** → a list of just that group.
* **Two or more groups** → a list of **tuples**.

```python
re.findall(r'(\w+)=(\d+)', 'a=1 b=22')     # [('a','1'), ('b','22')]
re.findall(r'(\w+)=\d+',   'a=1 b=22')     # ['a', 'b']
re.findall(r'\w+=\d+',     'a=1 b=22')     # ['a=1', 'b=22']
```
If you accidentally add a group for `|` or `?`, your results change shape.
Use a **non-capturing group** `(?: )` to avoid that.

### re.finditer
```python
for m in re.finditer(r'(\w+)=(\d+)', text):
    print(m.group(1), m.group(2), m.start())
```
Same matches, but as match objects — so you get positions and named groups too.

### Reading the whole input at once
`findall` works best on one big string:
```python
text = sys.stdin.read()
```
That lets patterns span the whole file rather than a line at a time.

---
## THE TASK

`page.html` is a scrap of HTML.

Write `q17.py` that reads stdin and prints:

```
links:
URL
...
emails:
ADDRESS
...
tags: TAG=COUNT TAG=COUNT ...
```

* **links** — every `href="..."` value, in the order they appear, duplicates kept.
* **emails** — every distinct email address, alphabetically sorted.
* **tags** — a count of every HTML tag name (opening tags only, so `</p>` doesn't
  count), listed alphabetically as `TAG=COUNT`, space separated. Tag names should be
  lowercased.

Run as: `./q17.py < page.html`

---
## HINTS
<details><summary>Hint 1</summary>
`re.findall(r'href="([^"]*)"', text)` — one group, so you get the URLs directly.
`[^"]*` is the "not a quote" trick: it stops at the closing quote.
</details>
<details><summary>Hint 2</summary>
Opening tags: a `<` followed by the tag name. A closing tag is `</p>` — the `/` is
not a letter, so a letters-only class already excludes it; you don't need an extra
rule for that.
Careful: `<h1>` — a tag name can contain digits after the first letter.
</details>

## CHECK
```sh
./test.sh
```
