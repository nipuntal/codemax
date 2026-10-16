# Module 25

```python
if len(sys.argv) < 2 or len(sys.argv) > 3:
    print(USAGE)
    return

room = sys.argv[1]
if len(sys.argv) == 3:
    print(f"room {room} on {sys.argv[2]}")
else:
    print(f"room {room}")
    print("no day given")
```

### The off-by-one

`sys.argv[0]` is the script's name. "Two arguments" means `len(sys.argv) == 3`.
Checking `== 2` when you wanted two arguments is the classic slip, and it is
worth doing deliberately a couple of times until it sticks.

### Why `return` and not `sys.exit()`

The driver's `finally` block closes the database connection. `sys.exit()` does
still run `finally` — but `return` is simpler and keeps the flow obvious: every
path through `main()` ends by falling off the bottom or returning, and the
driver handles the rest.

### f-strings

```python
print(f"room {room} on {sys.argv[2]}")
```

Anything inside `{}` is evaluated and inserted. That is nearly all the
formatting you will need, though there is more to it than this — enough that a
later module is devoted to getting output exactly right, because the marking
compares characters.

### Printing `USAGE`

The template defines it once, at the top, using the script's real name:

```python
USAGE = f"Usage: {sys.argv[0]} Room [Day]"
```

So it prints `Usage: ./q25.py Room [Day]` and stays correct if the file is
renamed. Print the variable — do not retype the sentence.

### Try it

```bash
./q25.py MECH-G15 Mon
./q25.py MECH-G15
./q25.py
./q25.py a b c
```
