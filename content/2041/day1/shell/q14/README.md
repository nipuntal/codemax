# Shell Q14 — variables, arguments, arithmetic  (full script)

**Difficulty:** ⭐⭐ · **Target time:** 6 min

---
## LEARN FIRST

### Variables
```sh
name="Alice"          # NO SPACES around =  (name = "Alice" is an error!)
echo "$name"          # $ to read it
echo "Hello, $name!"  # inside double quotes, $ still expands
echo 'Hello, $name'   # inside SINGLE quotes it does NOT
```
**Always double-quote your variables**: `"$name"`. Without quotes, a value containing
spaces breaks into multiple words and your script misbehaves.

### Command-line arguments
| variable | meaning |
|---|---|
| `$0` | the script's own name |
| `$1` `$2` … | first, second argument |
| `$#` | how many arguments |
| `$@` | all arguments (use as `"$@"`) |

### Arithmetic
```sh
n=$((3 + 4))          # $(( )) does integer maths
n=$((n + 1))          # note: no $ needed on n INSIDE $(( ))
echo $((10 / 3))      # 3  -- integer division, truncates
echo $((10 % 3))      # 1  -- remainder
```

### Command substitution
```sh
count=$(wc -l < file.txt)     # capture a command's output into a variable
echo "There are $count lines"
```
Use `$( )`, not backticks.

### Skeleton of every bash script in this course
```sh
#!/bin/dash          # or #!/bin/bash
if [ $# -ne 2 ]; then
    echo "Usage: $0 <arg1> <arg2>" 1>&2
    exit 1
fi
```
`1>&2` sends the message to **stderr** (where error messages belong), and
`exit 1` signals failure. Exam questions often award a mark for exactly this.

---
## THE TASK

Write `q14.sh`, a script taking exactly **two integer arguments**.

It must print, each on its own line:
```
sum: S
difference: D
product: P
quotient: Q
```
where D is `$1 - $2`, and Q is integer division `$1 / $2`.

If the number of arguments is not exactly 2, print
`Usage: ./q14.sh <int> <int>` to **stderr** and exit with status 1.

Test invocation: `./q14.sh 17 5`

---
## HINTS
<details><summary>Hint 1</summary>
`echo "sum: $(($1 + $2))"`
</details>

## CHECK
```sh
./test.sh
./q14.sh          # should print usage to stderr, exit 1
echo $?           # should be 1
```
