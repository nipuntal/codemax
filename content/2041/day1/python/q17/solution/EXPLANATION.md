# Python Q17 explanation

```python
text = sys.stdin.read()
```
`findall` on the whole file at once. Reading line by line would miss anything spanning
a line break — and the emails in this file do wrap.

## links
```python
links = re.findall(r'href="([^"]*)"', text)
```
* `href="` literal
* `([^"]*)` — group 1: any number of characters that are **not a quote**
* `"` the closing quote

`[^"]*` is the key idea. Writing `(.*)` would be greedy and swallow everything up to
the *last* quote on the line. **"Anything except the terminator" is how you stop a
match at the right place** — the same trick as `[^,]+` in the shell set.

One group → `findall` returns the group contents, not the whole `href="..."` text.
That's exactly what we want.

## emails
```python
emails = re.findall(r'[\w.]+@[\w.]+\.\w+', text)
```
No groups → whole matches. `[\w.]` is word characters plus a dot (inside `[ ]` the
dot is literal — no escaping needed).

```python
for email in sorted(set(emails)):
```
`set` deduplicates (the admin address appears twice), `sorted` orders them.

## tags
```python
tags = re.findall(r'<([a-zA-Z][a-zA-Z0-9]*)', text)
```
`<`, then a letter, then any number of letters or digits.

**Why not `[a-zA-Z]+`?** Because `<h1>` would match only `h` — the `1` isn't in the
class, so the match just stops early and you silently get a tag called `h`. A regex
that matches *less* than you meant produces no error at all; it produces a wrong
answer. Whenever your pattern can stop early, ask what the next character is. A closing tag is `</p>` — after the `<` comes `/`,
which isn't in `[a-zA-Z]`, so it doesn't match. **No explicit "not a slash" rule is
needed**; the character class already excludes it. Recognising that saves you a
messier pattern like `<(?!/)([a-zA-Z]+)`.

Then the standard counting idiom and the sorted summary.

## The findall group rule, restated
| pattern | result |
|---|---|
| `r'<[a-zA-Z]+'`   | `['<html', '<head', ...]` — whole matches |
| `r'<([a-zA-Z]+)'` | `['html', 'head', ...]` — group 1 |
| `r'<([a-z])([a-z]*)'` | list of 2-tuples |

If your `findall` result is a list of tuples and you didn't expect it, you have more
groups than you meant. Change the extra ones to `(?: )`.
