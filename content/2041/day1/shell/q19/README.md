# Shell Q19 — case statements and functions  (full script)

**Difficulty:** ⭐⭐⭐ · **Target time:** 9 min

---
## LEARN FIRST

### case — pattern-matching on a string
```sh
case "$1" in
    -h|--help)  echo "help text" ;;
    -v)         verbose=1 ;;
    -*)         echo "unknown option $1" 1>&2; exit 1 ;;
    *.txt)      echo "a text file" ;;
    *)          echo "something else" ;;
esac
```
* Patterns are **globs**, not regexes: `*`, `?`, `[abc]`, `|` for alternatives.
* Each branch ends with `;;`.
* `*)` is the catch-all — put it **last**, since the first match wins.
* `esac` closes it.

`case` is much cleaner than a long `if` chain when you're matching string shapes,
and it's the standard way to parse options in a shell script.

### Functions
```sh
usage() {
    echo "Usage: $0 <file>" 1>&2
    exit 1
}

greet() {
    echo "Hello, $1"      # $1 is the FUNCTION's first argument, not the script's
}

greet Alice
```
* No `function` keyword needed, no argument list in the parentheses.
* Inside a function, `$1 $2 $@ $#` refer to the **function's** arguments.
* `return N` sets the exit status; to "return a value" you `echo` it and the caller
  captures with `$( )`.

### Shifting arguments
```sh
while [ $# -gt 0 ]; do
    case "$1" in
        -n) count=$2; shift ;;
        *)  break ;;
    esac
    shift
done
```
`shift` discards `$1` and renumbers the rest. This is the standard option-parsing loop.

---
## THE TASK

Write `q19.sh`, a file classifier. For each filename argument, print:
```
FILENAME: TYPE
```
where TYPE is decided by the **extension**:

| extension | TYPE |
|---|---|
| `.txt` `.md`        | text |
| `.sh`               | shell script |
| `.py`               | python script |
| `.png` `.jpg` `.gif`| image |
| anything else       | unknown |

Also support one option: if the **first** argument is `-q`, print only the TYPE
(no `FILENAME: ` prefix) for all the remaining arguments.

If there are no filename arguments left, print `Usage: ./q19.sh [-q] file...`
to stderr and exit 1.

Test invocation: `./q19.sh notes.txt run.sh main.py logo.png data.csv README.md`

---
## HINTS
<details><summary>Hint 1</summary>
Handle `-q` first with an `if` + `shift`, then loop over `"$@"` with a `case`.
</details>
<details><summary>Hint 2</summary>
Write a `classify()` function that echoes the type — it keeps the loop tiny.
</details>

## CHECK
```sh
./test.sh
./q19.sh -q a.txt b.py
```
