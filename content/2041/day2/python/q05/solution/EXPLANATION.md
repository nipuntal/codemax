# Q5 explanation

```python
n = int(sys.argv[1])
counts = {}

for line in sys.stdin:
    original = line.rstrip('\n')
    key = ' '.join(original.lower().split())
    counts[key] = counts.get(key, 0) + 1
    if counts[key] == n:
        print(f"Snap: {original}")
        break
```

## Two variables, on purpose
`original` is what you print. `key` is what you compare. Keeping both is the entire
trick — the spec compares fuzzily but outputs exactly.

A very common wrong version:
```python
    line = ' '.join(line.lower().split())    # destroys the original
    ...
    print(f"Snap: {line}")                   # prints the normalised form
```
It passes the simple cases (where the lines happen to be already normalised) and fails
the moment the snapping line has odd spacing — which is exactly what the test data
checks.

## `' '.join(s.lower().split())`
| input | key |
|---|---|
| `"hi"`        | `"hi"` |
| `"  HI"`      | `"hi"` |
| `"hi hi"`     | `"hi hi"` |
| `"hi   HI"`   | `"hi hi"` |
| `"HELLO WORLD"` | `"hello world"` |

`.split()` with no argument discards leading/trailing whitespace and collapses runs, so
the `join` puts back exactly one space between tokens. Tabs are handled too.

## Increment, then test
```python
counts[key] = counts.get(key, 0) + 1
if counts[key] == n:
```
The count now includes the line just read, so `== n` fires on the nth occurrence.
Testing before incrementing would fire one line late.

## `break` is required
The spec says *stop reading input*. Without `break` the program drains stdin, which is
observable — in `prog | q05.py 2` the upstream program would keep running.
"Stop and not read any further input" in a spec means `break`, not a flag.

## "Print nothing" needs no code
If stdin ends first, the loop exits normally and nothing was printed. The absence of
output is the natural behaviour, so there is nothing to write.

## `int(sys.argv[1])`
`counts[key] == "2"` is never true — an int is never equal to a string. This fails
silently: the program just never snaps. Convert arguments the moment you read them.
