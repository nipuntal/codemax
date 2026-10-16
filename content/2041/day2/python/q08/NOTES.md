# Notes — `for ... else`, and stopping mid-stream

This is the *distinct_lines* weekly test, counting words instead of lines.

## Read the spec twice: when is the check made?
The message reports how many **lines** were read. In the second example, `HELLO there friend`
pushes the distinct count from 2 straight to 4 — but the answer is "after 3 lines". So you check the count **after finishing each line**, not after each
word.

If instead you tested inside the word loop and broke immediately, you'd still get 3 here
— but consider a line whose *first* word completes the set: you'd report the same line
count either way. The distinction bites when the spec asks for the words seen, or for
the offending word. **Work out where the check belongs before you write the loops.**

## Tracking distinct things
```python
seen = set()
for word in line.lower().split():
    seen.add(word)
```
A set, because you only care *whether* you've seen a word, not how many times.
`len(seen)` is the distinct count. `.add()` on something already present is a no-op —
no `if` needed.

## `for ... else` — the right tool for "if the loop finished without breaking"
```python
for line in sys.stdin:
    ...
    if len(seen) >= n:
        print(f"{n} distinct words seen after {lines} lines read.")
        break
else:
    print(f"End of input reached after {lines} lines read - {n} different words not seen.")
```
The `else` clause of a `for` loop runs **only if the loop was not broken out of**.
That is exactly the "end of input reached first" case, with no flag variable.

It reads badly the first time (`else` on a loop?). Think of it as
**`for ... then-if-no-break`**. It's genuinely examinable in COMP2041 and it removes a
whole class of flag-variable bugs.

The flag version is equally correct if you prefer it:
```python
found = False
for line in sys.stdin:
    ...
    if len(seen) >= n:
        found = True
        break
if not found:
    ...
```

## `>= n`, not `== n`
One line can add several new words, so the count can jump from 2 straight to 4.
`== n` would miss it and the program would never report. This is the single most likely
bug in this question — the *distinct_lines* original could only ever increment by one,
so `==` worked there. Changing "lines" to "words" changes the right operator.

## Counting lines
Increment a counter at the **top** of the loop body, so the line currently being
processed is included in `L`.

## Edge cases
* `n = 1` and a 3-word first line → `1 distinct words seen after 1 lines read.`
  Note the spec's grammar: "1 distinct words", "1 lines". Don't fix it — **copy the
  format exactly.**
* `Hello World` / `hello world` — case-folded, so those two lines give 2 distinct
  words, not 4. Line 3 then adds `there` and `friend`, jumping straight from 2 to 4 —
  which is exactly why the check must be `>= n`.
* Empty input → 0 lines, the `else` branch fires.
* A blank line contributes 0 words but still counts as a line read.
