# Q17 explanation

```sh
best=""
best_n=-1

for f in "$@"; do
    n=$(wc -L < "$f")
    if [ "$n" -gt "$best_n" ]; then
        best_n=$n
        best=$f
    fi
done

echo "$best"
```

## The running maximum
Two variables: the best value seen (`best_n`) and the thing that achieved it (`best`).
Update both together, inside the same `if`. Updating one and forgetting the other is
the classic bug — it's why they're adjacent lines.

`best_n=-1` seeds below any real length, so the first file always wins the first
comparison. Alternatively seed from `$1` before the loop; the `-1` trick is shorter.

## `-gt` vs `-ge`
`-gt` keeps the **first** file among ties; `-ge` keeps the **last**. The spec says
either is fine, but be deliberate — plenty of questions specify "the first", and then
this single character is the whole mark.

## `wc -L < "$f"` — the redirect matters
```sh
wc -L "$f"      #    58 long.txt      <- filename included
wc -L < "$f"    #    58               <- just the number
```
Inside `$( )` you want the number alone, so redirect. This applies to `wc -l`, `-w`
and `-c` equally and it comes up in almost every script question.

## `wc -L` is not POSIX
`wc -l`, `-w`, `-c` are standard. `-L` (longest line) is a GNU extension that BSD/macOS
also implements — convenient, but worth knowing it's an extension. If a question's
rules restrict you to POSIX filters, measure line lengths another way rather than
assuming `-L` exists.

## `"$@"` and `"$f"`
Quoted throughout, so a filename containing a space stays one argument and one
operand. This is not hypothetical — markers test it.

## Testing
```sh
dash -n q17.sh          # syntax check
./q17.sh short.txt      # single argument
./q17.sh *.txt          # several
```
Always run the one-argument case: it exercises the loop's initialisation, which is
where the bugs live.
