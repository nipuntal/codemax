# Python Q16 explanation

## The pattern
```python
pattern = re.compile(r'\[(\S+) (\S+)\] (\w+) \((\w+)\) (.*)')
```
| piece | matches | group |
|---|---|---|
| `\[`      | a literal `[` | |
| `(\S+)`   | the date (non-space run) | 1 |
| ` `       | a literal space | |
| `(\S+)`   | the time | 2 |
| `\]`      | a literal `]` | |
| `(\w+)`   | the level | 3 |
| `\(`      | a literal `(` | |
| `(\w+)`   | the module | 4 |
| `\)`      | a literal `)` | |
| `(.*)`    | the rest of the line | 5 |

**`[`, `]`, `(`, `)` are regex metacharacters.** To match them literally you escape
them: `\[` `\]` `\(` `\)`. Forgetting this is the classic failure here — an unescaped
`(` just starts a group and silently changes the numbering.

## re.compile
```python
pattern = re.compile(r'...')
m = pattern.fullmatch(line)
```
Compiling once outside the loop is slightly faster and keeps the loop readable.
`re.fullmatch(r'...', line)` inside the loop is equally correct — Python caches
compiled patterns anyway. Use whichever you find clearer.

## Unpacking all the groups at once
```python
    date, time, level, module, message = m.groups()
```
`m.groups()` is a 5-tuple, unpacked into five names. Much nicer than five
`m.group(n)` calls — and it fails loudly if your group count is wrong, which is a
feature.

## The `if not m: ... continue` guard
```python
    if not m:
        malformed += 1
        print(f"malformed: {line}")
        continue
```
`continue` means the rest of the loop body assumes `m` is valid, so there's no
indentation pyramid. This "**guard clause then continue**" shape is worth adopting
everywhere.

`[10:16:00] INFO missing module` is malformed because there's no space-separated
date/time pair inside the brackets and no `(module)`.

## The summary
```python
summary = " ".join(f"{lv}={levels[lv]}" for lv in sorted(levels))
```
A generator expression producing `"ERROR=2"`, `"INFO=3"`… joined with spaces.
`sorted(levels)` gives the keys alphabetically, which the spec requires.
