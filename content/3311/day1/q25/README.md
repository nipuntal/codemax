# Module 25 &nbsp;·&nbsp; Python + Psycopg2

## The script the exam hands you


## LEARN FIRST

Two of the five practical exam questions are Python scripts. They are marked by
running them with arguments and comparing what they print, **character for
character**.

Almost nothing about Python itself changes here. What is new is a library —
**psycopg2** — that lets a Python program run the SQL you have been writing.

### The template

Every Python question starts from a file like this. It is worth being able to
recognise every line, because you will be given it and told not to break it.

```python
#!/usr/bin/env python3
"""
COMP3311 26T2 -- Module 25
"""
import sys
import psycopg2

### Globals
USAGE = f"Usage: {sys.argv[0]} Name [Number]"
db = None


### Main part of script
def main():
    ### your code goes here ###


### Driver to invoke main code
if __name__ == '__main__':
    try:
        db = psycopg2.connect(dbname="classes")
        main()
    except psycopg2.Error as err:
        print("DB error: ", err)
    except Exception as err:
        print("Internal Error: ", err)
        raise err
    finally:
        if db is not None:
            db.close()
    sys.exit(0)
```

Line by line:

- `#!/usr/bin/env python3` lets you run it as `./q25.py` rather than
  `python3 q25.py`. The file must also be executable — the templates here
  already are.
- `import psycopg2` brings in the PostgreSQL library.
- `db = None` at the top is what makes `if db is not None` safe at the bottom.
  If `connect` itself failed, `db` would never have been assigned, and without
  that initial `None` the `finally` block would raise a `NameError` of its own.
- `if __name__ == '__main__':` means the code below runs only when the file is
  executed directly.
- `try / except / finally` — the safety net.
- `db.close()` in `finally` always runs, whatever happened.

**Write your code inside `main()`. Do not delete the driver.**

### Command-line arguments

`sys.argv` is a list of strings. `sys.argv[0]` is the **program's own name**, so
the real arguments start at index 1.

```
$ ./q25.py MECH-G15 Mon
sys.argv == ['./q25.py', 'MECH-G15', 'Mon']
```

The off-by-one everybody hits once:

| you type | `len(sys.argv)` |
|---|---|
| `./q25.py` | 1 |
| `./q25.py A` | 2 |
| `./q25.py A B` | 3 |

Checking you got what you expected:

```python
def main():
    if len(sys.argv) != 3:
        print(USAGE)
        return
    room = sys.argv[1]
    day  = sys.argv[2]
```

### Arguments are always strings

```python
n = int(sys.argv[2])
```

`sys.argv[2]` is the string `'5'`, not the number 5. Without `int()`,
`sys.argv[2] * 2` gives `'55'` — string repetition — which is a wrong answer
that produces no error at all.

If the argument might not be a number:

```python
try:
    n = int(sys.argv[2])
except ValueError:
    print(USAGE)
    return
```

### `return`, not `sys.exit()`

The driver's `finally` closes the connection. `return` from `main()` lets that
happen naturally and keeps all the exit logic in one place.

### Running it

```bash
chmod 755 q25.py     # already done for you
./q25.py MECH-G15 Mon
python3 q25.py MECH-G15 Mon      # equivalent
```

---

## THE TASK

No database yet — just arguments.

Write `q25.py` so that:

- with **exactly two** arguments, it prints `room NAME on DAY`
- with **one** argument, it prints `room NAME` and then `no day given`
- with **none, or more than two**, it prints the `USAGE` line and nothing else

```
$ ./q25.py MECH-G15 Mon
room MECH-G15 on Mon
$ ./q25.py MECH-G15
room MECH-G15
no day given
$ ./q25.py
Usage: ./q25.py Room [Day]
```

## Hints

<details><summary>Hint 1</summary>

Three cases, decided by `len(sys.argv)` — remember the name counts as one.
</details>

<details><summary>Hint 2</summary>

`USAGE` is already defined at the top of the template. Print that variable
rather than retyping the text.
</details>
